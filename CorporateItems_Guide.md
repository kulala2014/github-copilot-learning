# Corporate Items — Setup, Usage & Architecture Guide

## Table of Contents

1. [Overview](#overview)
2. [Corporate Items vs Regular Items](#corporate-items-vs-regular-items)
3. [Architecture & Data Model](#architecture--data-model)
4. [Setup Guide](#setup-guide)
5. [Usage Workflow](#usage-workflow)
6. [Item Inheritance & Override](#item-inheritance--override)
7. [Publishing Corporate Items](#publishing-corporate-items)
8. [Category / SubCategory Setup](#category--subcategory-setup)
9. [Corporate Item Export Report](#corporate-item-export-report)
10. [Permissions](#permissions)
11. [Database Reference](#database-reference)
12. [Troubleshooting](#troubleshooting)

---

## Overview

**Corporate Items** is a feature that allows a company to manage a centralized menu (item list) at the corporate level, which is then shared across multiple store locations. When items are defined at the corporate level, all assigned locations automatically inherit those items. Individual locations can optionally override specific item properties (price, text, images, etc.) while still staying connected to the corporate definition.

### Key Benefits
- **Centralized management** — Define items once, push to many locations
- **Consistency** — Ensures all locations share the same base menu
- **Flexibility** — Locations can override specific properties as needed
- **Efficiency** — Changes at the corporate level propagate to all assigned locations on publish

---

## Corporate Items vs Regular Items

| Aspect | Regular (Location) Items | Corporate Items |
|--------|-------------------------|-----------------|
| **Scope** | Single location | Shared across multiple locations |
| **OrderProcess.IsAbstract** | `false` | `true` |
| **OrderProcess.LocationId** | Actual location GUID | `Guid.Empty` |
| **Ownership** | Belongs to one location's menu | Belongs to a "Corporate Item List" |
| **Inheritance** | No parent chain (unless tied to corporate) | Can have parent corporate lists (chaining) |
| **Item Editing** | Direct editing on Items.aspx | Items.aspx in `CorporateItemEdit` mode |
| **Publishing** | Publishes to single location | Publishes to ALL assigned locations recursively |
| **Category Source** | Location's transaction DB | Requires a location context for category lookup |
| **Export Class** | `ItemExport` | `CorporateItemExport` |
| **Override State** | `Local` (no corporate parent) | `Corporate` (inherited) or `Override` (locally changed) |

### How They Connect

When a location is **assigned** to a corporate item list:
1. The location's `OrderProcess` record gets its `ParentOrderProcessId` set to the corporate `OrderProcessId`
2. All items defined in the corporate list become visible at the location level
3. Location-level items with the same `Identifier` **override** the corporate version
4. Properties not explicitly set at the location level **inherit** from the corporate parent

```
Corporate Item List (OrderProcess: IsAbstract=true)
    │
    ├── Location A's OrderProcess (ParentOrderProcessId → Corporate OP)
    │       Items here can override corporate items
    │
    ├── Location B's OrderProcess (ParentOrderProcessId → Corporate OP)
    │       Items here inherit corporate items
    │
    └── Location C's OrderProcess (ParentOrderProcessId → Corporate OP)
            Items here mix inherited + overridden items
```

---

## Architecture & Data Model

### Database Tables

```
┌─────────────────────────┐         ┌──────────────────────────┐
│      OrderProcess        │         │  OrderProcessLocations   │
├─────────────────────────┤         ├──────────────────────────┤
│ OrderProcessId (PK)      │◄────────│ OrderProcessId (FK)      │
│ LocationId               │         │ LocationId (FK)          │
│ LocationMenuId           │         │ PendingChange (int)      │
│ IsAbstract (bit)         │         └──────────────────────────┘
│ IsSavedCopy (bit)        │
│ ParentOrderProcessId     │──── self-referencing FK
│ CompanyId                │         (corporate chain OR location→corporate)
│ ThemeId                  │
│ Name                     │
│ CombosXml                │
└─────────────────────────┘
          │
          │ 1:many
          ▼
┌─────────────────────────┐      ┌──────────────────────┐
│         Item             │      │     ItemClass         │
├─────────────────────────┤      ├──────────────────────┤
│ ItemIntId (PK)           │      │ ItemClassId (PK)      │
│ OrderProcessId (FK)      │      │ ParentItemClassId     │  ← self-ref
│ Identifier (unique)      │      │ LocationNumber        │     (Category/SubCategory)
│ POSId                    │      │ Name                  │
│ ItemClassId (FK)         │──────│                       │
│ ParentItemClassId (FK)   │──────│                       │
│ IsEnabled                │      └──────────────────────┘
│ IsSuppressed             │         (stored in Transaction DB)
│ ... (many fields)        │
└─────────────────────────┘
          │ 1:many
          ▼
   ItemText, ItemPrice, ItemMedia, ItemAttribute,
   ItemRecipe, ItemUOM, SuggestedModifier
```

### OrderProcess Record Types

| `IsAbstract` | `IsSavedCopy` | `LocationId` | Description |
|:-:|:-:|:-:|---|
| `true` | `false` | `Guid.Empty` | **Corporate Item List** (live) |
| `true` | `true` | `Guid.Empty` | Corporate Item List (**saved/draft copy**) |
| `false` | `false` | Set | **Location Menu** (live) |
| `false` | `true` | Set | Location Menu (**saved/draft copy**) |

### OrderProcessLocations — Junction Table

Links corporate item lists to locations. The `PendingChange` column tracks uncommitted add/remove operations:

| PendingChange Value | Enum | Meaning |
|:-:|---|---|
| `3` | `Add_MoveAllItemsToCorporateLevel` | Pending: move location items up to corporate |
| `2` | `Add_RemoveAllItemsWherePOSIDExists` | Pending: remove matching POSIDs at location |
| `1` | `Add_RemoveAllExistingItems` | Pending: remove all location items |
| `0` | `NoChanges` | Committed — location is actively linked |
| `-1` | `Remove_DisconnectAndRemoveCorporateItems` | Pending: disconnect and delete corporate items |
| `-2` | `Remove_CopyAllCorporateItemsToLocationLevel` | Pending: copy corporate items to location, then disconnect |

---

## Setup Guide

### Prerequisites
1. User must have **CustomerMaintenance** page rights (for admin-level setup)
2. User must have **MenuManagement_CorporateItems** permission (for menu-level editing)
3. A **Company** and at least one **Location** must exist
4. A **Theme** should be configured for the company

### Step 1: Create a Corporate Item List

1. Navigate to **Customer Maintenance → Corporate Items** page
   - Path: `Web/CustomerMaintenance/CorporateItems.aspx`
2. Click **Add**
3. Enter a **Name** for the corporate item list (e.g., "National Menu")
4. Select a **Theme** from the dropdown
5. Optionally select a **Parent** corporate item list (for hierarchical chaining)
6. Click **Save**

### Step 2: Add Locations to the Corporate Item List

1. In the Corporate Items editor, click **Add Location**
2. A modal popup appears showing available locations
3. Select a **Location** from the dropdown
4. Choose an **Add Strategy**:
   - **Remove all existing items at this location** — Clears the location's current items and connects it to corporate
   - **Remove items where POSID exists at corporate level** — Only removes location items that have matching POSIDs in the corporate list
   - **Move all items to corporate level** — ⚠️ **Destructive**: Copies all location items up to the corporate list, then removes them from the location. Use only when building a corporate list FROM an existing location menu
5. Click **OK**
6. The location now shows with a **Pending** status

### Step 3: Publish Location Changes

1. Click **Publish Changes** on the Corporate Items page
2. The system will:
   - Process each pending add/remove operation
   - Set `ParentOrderProcessId` on location OrderProcess records
   - Execute the selected add/remove strategy
   - Publish updated items to affected locations
   - Send `SAVEADMIN` commands to the locations

### Step 4: Add Items to the Corporate List

1. Navigate to **Menu Management → Corporate Items** (or click the corporate list name)
   - Path: `Web/MenuManagement/Default.aspx` (Corporate Items section)
2. Click on a Corporate Item List name
3. The system redirects to `Items.aspx?corp=true` in **CorporateItemEdit** mode
4. Add/edit items as usual — these items will be shared across all assigned locations
5. Save and **Publish** when ready

---

## Usage Workflow

### Day-to-Day Operations

```
┌──────────────────────────────────────────────────────────────┐
│  ADMIN (Customer Maintenance)                                │
│                                                              │
│  1. Create/manage Corporate Item Lists                      │
│  2. Add/Remove Locations from lists                         │
│  3. Publish location changes                                 │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  MENU EDITOR (Menu Management)                               │
│                                                              │
│  1. Select a Corporate Item List                            │
│  2. Edit items in CorporateItemEdit mode                    │
│  3. Save (creates saved/draft copy)                         │
│  4. Publish → PublishCorporateItems.aspx                    │
│     ├── Copies saved copy to live                           │
│     ├── For EACH assigned location:                         │
│     │   ├── Merges combos XML                               │
│     │   ├── Serializes items XML                            │
│     │   ├── Sends SAVEADMIN command                         │
│     │   └── Creates audit trail                             │
│     └── Recursively publishes to child corporate lists      │
└──────────────────────────────────────────────────────────────┘
```

### Removing a Location from Corporate Items

1. In **Customer Maintenance → Corporate Items**, find the location in the grid
2. Click **Delete** next to the location
3. Choose a **Remove Strategy**:
   - **Disconnect and remove all corporate items** — The location loses all corporate items
   - **Copy all corporate items to location level** — Corporate items become local items at the location, then the corporate link is severed
4. Click **OK**
5. Click **Publish Changes** to commit

### Undoing Pending Changes

If you've added or removed locations but haven't published yet, click **Undo Changes** to revert all pending add/remove operations.

---

## Item Inheritance & Override

### How Inheritance Works

When a location's OrderProcess has a `ParentOrderProcessId` pointing to a corporate OrderProcess, every item at the location can have a **Parent** item — the matching item (by `Identifier`) in the corporate list.

Each item property follows this inheritance pattern:

```csharp
// Getter: fall back to parent if local value is null
if (_localValue == null && Parent != null)
    return Parent.PropertyName;  // Inherited from corporate
return _localValue;              // Local value (overridden)

// Setter: clear local override when value matches parent
if (parent != null && parent.PropertyName == value)
    _localValue = null;   // Revert to inheritance
else
    _localValue = value;  // Store local override
```

### Inherited Properties (23 properties)

All of the following properties inherit from the corporate parent when not explicitly set at the location level:

| Property | Type | Description |
|----------|------|-------------|
| `POSId` | string | Point-of-sale identifier |
| `IsEnabled` | bool? | Active/inactive status |
| `IsUnit` | bool? | Unit item flag |
| `BuildGroup` | string | Build group assignment |
| `Category1` | string | Category field 1 |
| `Category2` | string | Category field 2 |
| `IsTaxExempt` | bool? | Tax exemption flag |
| `DayPart` | string | Day part restriction |
| `Type` | ItemType? | Item or Modifier |
| `IsEmployeeOnly` | bool? | Employee-only flag |
| `IsAlcohol` | bool? | Alcohol flag |
| `IsUpSell` | bool? | Upsell flag |
| `PrepTime` | int? | Preparation time |
| `IsSampleSlice` | bool? | Sample slice flag |
| `IsNew` | bool? | "New" promotion flag |
| `IsSale` | bool? | "Sale" promotion flag |
| `InventoryClassId` | Guid? | Inventory class reference |
| `ItemClassId` | Guid? | Category/SubCategory reference |
| `ParentItemClassId` | Guid? | Parent category reference |
| `IsDiscount` | bool? | Discount flag |
| `IsLookupOnly` | bool? | Lookup-only flag |
| `Category` | string | Resolved category name (display text) |
| `SubCategory` | string | Resolved subcategory name (display text) |

### Override States

Each item has an `OverrideState` that indicates its relationship to the corporate parent:

| State | Value | Meaning |
|-------|:-----:|---------|
| `Local` | 0 | Item belongs only to this OrderProcess — no corporate parent exists |
| `Corporate` | 1 | Item is identical to the corporate parent (fully inherited, no local changes) |
| `Override` | 2 | Item has local differences from the corporate parent |

### Suppressed Items

An item can be **suppressed** (`IsSuppressed = true`) at the location level. This means:
- The corporate item is deliberately blocked from appearing at this location
- The item won't show in the flattened DataTable
- It counts as a "difference" from the corporate parent (`OverrideState = Override`)

### Data Flattening (AppendItemsDataTable)

When building the export DataTable, items are processed **child-first, then parent**:

1. Location OP's items are added to the DataTable first
2. When a location item accesses its `Parent`, the corporate parent item gets marked `IsOverridden = true`
3. Corporate OP's items are appended next, but `IsOverridden` items are **skipped**
4. This ensures only the location's overridden version appears (not both)
5. Non-overridden corporate items pass through as `OverrideState = Corporate`

---

## Publishing Corporate Items

### From Menu Management (PublishCorporateItems.aspx)

This page is reached after saving items in `CorporateItemEdit` mode.

**Publish flow:**
1. **Copy saved → live**: `CopySavedToLiveForCorporate()` promotes draft items to live
2. **For each assigned location** (skipping those with pending add/remove):
   - Clear override flags
   - Merge combos XML between location and corporate
   - Create location-specific OrderProcess with `ParentOrderProcess = corpOP`
   - Serialize items XML
   - Save to live
   - Build `SAVEADMIN` XML command
   - Send command to location via `LicensingUtility.SendCommand()`
   - Create audit trail entry
3. **Recursively process child corporate lists** via `GetChildOrderProcesses()`

### Override Local Pricing Option

If the user has `MenuManagement_AllowCorpPriceToOverrideLocalPrice` permission, a checkbox appears:
- **Checked**: Corporate prices overwrite location-level price overrides during publish
- **Unchecked** (default): Location price overrides are preserved

### From Customer Maintenance (CorporateItems.aspx)

The "Publish Changes" button on the admin page processes **location add/remove operations** only:

| Add Strategy | What Happens |
|---|---|
| Remove all existing items | Deletes all items from the location (saved + live) |
| Remove items where POSID exists | Removes location items whose POSID matches a corporate item |
| Move all items to corporate level | ⚠️ Copies location items to corporate, deletes location items |

| Remove Strategy | What Happens |
|---|---|
| Disconnect and remove corporate items | Removes all items that have a parent (corporate items) |
| Copy corporate items to location level | Copies corporate items into the location, then disconnects |

---

## Category / SubCategory Setup

### How Categories Work

Categories are stored in the **Transaction Database** (not the menu database) via the `ItemClass` table. They are resolved at runtime by matching GUIDs:

1. Each **Item** has `ItemClassId` and `ParentItemClassId` (GUIDs)
2. `ItemClass_Search` stored procedure looks up category names by `@LocationNumber`
3. During `ItemCollection.Load()`, the system calls `ItemClass.GetAllItemClasses(companyId, locationIdentifier, ...)` to get all categories for the location
4. Each item's `ItemClassId` is matched against the result to resolve **Category** and **SubCategory** display names

### Category Resolution Logic

```
If Item has ItemClassId only (no ParentItemClassId):
    → Category = ItemClass.Name for ItemClassId
    → SubCategory = (empty)

If Item has both ItemClassId AND ParentItemClassId:
    → Category = ItemClass.Name for ParentItemClassId (the parent)
    → SubCategory = ItemClass.Name for ItemClassId (the child)
```

### Where to Set Categories

Categories are managed **within the Items editor** (Items.aspx), not on a separate page:

1. Open **Menu Management → Items** (or Corporate Items in CorporateItemEdit mode)
2. Click an item to edit
3. Go to **ADVANCED → GENERAL** tab
4. Find the **Category / Sub Category** dropdowns (the `ItemClassPrompt` control)
5. Select or create a Category
6. Optionally select or create a Sub Category
7. Save

The `ItemClassPrompt` control allows:
- **Selecting** an existing category from the dropdown
- **Adding** a new category (enters a name, creates `ItemClass` record)
- **Editing** an existing category name
- **Deleting** a category (only if not in use by any items)

### Important for Corporate Item Export

For Category/SubCategory to appear in the **Corporate Item Export** report:
1. The items must have `ItemClassId` assigned (via the ItemClassPrompt control)
2. The **Transaction Database** must have matching `ItemClass` records for the selected location
3. The `ItemClass_Search` stored procedure must return rows for the given `@LocationNumber`

**If categories are empty in the export**, check:
```sql
-- Verify items have ItemClassId
SELECT Identifier, POSID, ItemClassId, ParentItemClassId
FROM Item
WHERE OrderProcessId = 'CORPORATE_OP_ID'
  AND ItemClassId IS NOT NULL
  AND ItemClassId != '00000000-0000-0000-0000-000000000000';

-- Verify transaction DB has ItemClass records for the location
EXEC ItemClass_Search @LocationNumber = 'LOCATION_IDENTIFIER', @IncludeAllChildClasses = 1;
```

---

## Corporate Item Export Report

### Configuration

The Corporate Item Export report is configured in the database:
- **DataSource**: `NEXTEP.Gateway.Common.API.ReportClasses.Export.CorporateItemExport` (fully qualified class name)
- **ChooseField**: `CorporateItems` (triggers the corporate items dropdown in the report UI)
- The report class is instantiated via reflection: `Activator.CreateInstance(Type.GetType(DataSource))`

### Parameters (prms array)

| Index | Value | Source |
|:-----:|-------|--------|
| `prms[0]` | Location Identifier | `ddlLocation.SelectedValue` |
| `prms[1]` | Corporate OrderProcess ID | `ddlCorporateItems.SelectedValue` |
| `prms[2]` | Company Identifier | Session `CompanyIdentifier` |

### CorporateItemExport vs ItemExport

```csharp
// ItemExport — loads a location's menu
_op = new OrderProcess(company, locationId, locationMenuId, false, true, companyId);
// Uses 6-param constructor → LoadLocationOrderProcess

// CorporateItemExport — loads a corporate list with location context
_op = new OrderProcess(company, corporateOpId, false, locationId, locationIdentifier);
// Uses 5-param constructor → LoadAbstractOrderProcess
// LocationIdentifier is set so ItemClass_Search can resolve categories
```

### Report UI Behavior

When a report with `ChooseField = "CorporateItems"` is selected:
1. A **Corporate Items** dropdown appears, showing all corporate item lists the user has access to
2. The **Location** dropdown is filtered to only show locations **tied to the selected corporate list**
3. Changing the corporate items selection re-filters the location dropdown
4. The report is hidden if the user lacks `MenuManagement_CorporateItems` permission

---

## Permissions

| Permission | Purpose | Required For |
|-----------|---------|--------------|
| `MenuManagement_CorporateItems` | Access to corporate items feature | Viewing/editing corporate items in Menu Management; viewing Corporate Item Export report |
| `MenuManagement_AllowCorpPriceToOverrideLocalPrice` | Price override during publish | Shows "Override Local Pricing" checkbox on PublishCorporateItems page |
| `MenuManagement_RevertAllCorporateOverrides` | Revert all overrides (NEXTEP users only) | Shows "Delete Corporate Overrides" button on Items page |
| `MenuManagement_EditItems` | Edit item properties | Editing items in CorporateItemEdit mode |
| `MenuManagement_EditPrice` | Edit prices | Changing item prices |
| `MenuManagement_SaveAllMenus` | Save to all menus | Multi-menu save options |
| `CustomerMaintenance` page rights | Admin-level access | Creating/deleting corporate lists, managing locations, publishing location changes |

---

## Database Reference

### Key Stored Procedures

| Stored Procedure | Purpose |
|-----------------|---------|
| `OrderProcess_GetAllOrderProcessByCompanyId` | Lists all corporate item lists for a company |
| `OrderProcess_GetAllOrderProcessByCompanyIdAndLocationIds` | Same, but filtered by user's accessible locations |
| `OrderProcess_GetOrderProcessByOrderProcessId` | Loads a single OrderProcess by ID |
| `OrderProcess_GetOrderProcess` | Loads a location OrderProcess by LocationId + MenuId |
| `OrderProcess_CreateOrderProcessLocation` | Links a location to a corporate list |
| `OrderProcess_UpdateOrderProcessLocation` | Updates pending status on a link |
| `OrderProcess_DeleteOrderProcessLocation` | Removes a location from a corporate list |
| `OrderProcess_ClearPendingLocationChanges` | Reverts all pending add/remove changes |
| `OrderProcess_GetOrderProcessLocationsByOrderProcessId` | Gets all linked locations with pending status |
| `OrderProcess_CopySavedToLiveForCorporate` | Promotes saved copy items to live |
| `OrderProcess_GetAllChildOrderProcesses` | Gets child corporate lists |
| `OrderProcess_AttachParentToAll` | Links all location menus to parent |
| `OrderProcess_DoesCorporateOrderProcessExist` | Checks if any corporate list exists for a company |
| `OrderProcess_GetAllItems` | Gets all items for an OrderProcess |
| `OrderProcess_DeleteAllItemsForOrderProcess` | Deletes all items under an OrderProcess |
| `OrderProcess_DeleteAllItemsThatHaveParent` | Removes items that inherited from a parent |
| `OrderProcess_DeleteAllItemsWherePOSIDExistsInParent` | Removes items with matching POSIDs in parent |
| `OrderProcess_MoveItemsToOrderProcess` | Moves items between OrderProcesses |
| `OrderProcess_CopyOrderProcess` | Copies items from one OP to another |
| `ItemClass_Search` | Looks up category names by LocationNumber |
| `ItemClass_Get` | Gets a single ItemClass record |
| `ItemClass_Insert` | Creates a new category |
| `ItemClass_Update` | Renames a category |
| `ItemClass_Delete` | Deletes a category |

### Key Source Files

| File | Purpose |
|------|---------|
| `src/NEXTEP.Gateway.Common/OrderProcess/OrderProcess.cs` | Core OrderProcess business logic (2677 lines) |
| `src/NEXTEP.Gateway.Common/OrderProcess/Item/ItemCollection.cs` | Item collection loading with parent chain |
| `src/NEXTEP.Gateway.Common/OrderProcess/Item/Item.cs` | Item entity with 23 inheritable properties |
| `src/NEXTEP.Gateway.Common/API/ReportClasses/Export/ItemExport.cs` | Regular item export |
| `src/NEXTEP.Gateway.Common/API/ReportClasses/Export/CorporateItemExport.cs` | Corporate item export |
| `src/NEXTEP.Gateway.Common/API/ItemClass.cs` | Category management API |
| `src/NEXTEP.Gateway.Common/API/ReportSettings.cs` | Report parameter assembly |
| `src/NEXTEP.Gateway/Web/CustomerMaintenance/CorporateItems.aspx.cs` | Admin corporate items page |
| `src/NEXTEP.Gateway/Web/MenuManagement/Default.aspx.cs` | Menu management entry point |
| `src/NEXTEP.Gateway/Web/MenuManagement/Items.aspx.cs` | Items editor (regular + corporate mode) |
| `src/NEXTEP.Gateway/Web/MenuManagement/PublishCorporateItems.aspx.cs` | Corporate items publish page |
| `src/NEXTEP.Gateway/WebControls/ItemClassPrompt.ascx.cs` | Category/SubCategory selection control |
| `src/NEXTEP.Gateway/Web/Reporting/Default.aspx.cs` | Report page with corporate items dropdown |

---

## Troubleshooting

### Category / SubCategory Empty in Export

**Symptom**: Corporate Item Export produces empty Category and SubCategory columns.

**Check 1**: Do items have `ItemClassId` assigned?
```sql
SELECT Identifier, POSID, ItemClassId, ParentItemClassId
FROM Item WHERE OrderProcessId = 'YOUR_CORP_OP_ID';
```
If `ItemClassId` is NULL or `00000000-0000-0000-0000-000000000000` for all items → **Items need categories assigned** via the Items editor (ADVANCED → GENERAL → Category dropdown).

**Check 2**: Does the transaction DB have ItemClass records for the location?
```sql
-- Run in the TRANSACTION database
EXEC ItemClass_Search @LocationNumber = 'YOUR_LOCATION_ID', @IncludeAllChildClasses = 1;
```
If this returns 0 rows → **No categories exist** for this location in the transaction database.

**Check 3**: Is the correct LocationIdentifier being used?
Check logs for: `ItemCollection.Load: Resolving categories. LocationIdentifier=...`

### Location Dropdown Empty in Corporate Item Export Report

**Cause**: The selected corporate item list has no locations assigned.

**Fix**: Assign locations via Customer Maintenance → Corporate Items → Add Location → Publish Changes.

### "Unable to delete corporate item list"

**Cause**: The list has locations tied to it.

**Fix**: Remove all locations first (Customer Maintenance → Corporate Items → delete each location row), then publish, then delete the list.

### Items Not Appearing at Location After Publishing

**Check**: Verify the location's OrderProcess has `ParentOrderProcessId` set to the corporate OrderProcess ID:
```sql
SELECT OrderProcessId, ParentOrderProcessId, IsAbstract, IsSavedCopy
FROM OrderProcess
WHERE LocationId = 'YOUR_LOCATION_ID';
```

### Corporate Items Not Visible in Menu Management

**Check**: Verify the user has `MenuManagement_CorporateItems` permission and that they have access to at least one location tied to a corporate list.
