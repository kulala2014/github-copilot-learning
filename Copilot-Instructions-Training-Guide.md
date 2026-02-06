# GitHub Copilot Custom Instructions 培训指南

> 📅 更新日期: 2026年2月  
> 📖 参考文档: [GitHub 官方文档](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions)

---

## 目录

1. [什么是 Copilot Custom Instructions？](#1-什么是-copilot-custom-instructions)
2. [Instructions 的三个层级](#2-instructions-的三个层级)
3. [入门篇：创建仓库级全局指令](#3-入门篇创建仓库级全局指令)
4. [进阶篇：创建路径特定指令](#4-进阶篇创建路径特定指令)
5. [高级篇：Prompt 文件（可复用提示模板）](#5-高级篇prompt-文件可复用提示模板)
6. [高级篇：Agent 指令文件](#6-高级篇agent-指令文件)
7. [最佳实践与常见场景](#7-最佳实践与常见场景)
8. [验证指令是否生效](#8-验证指令是否生效)
9. [常见问题解答](#9-常见问题解答)
10. [实战练习](#10-实战练习)

---

## 1. 什么是 Copilot Custom Instructions？

### 简介

Custom Instructions（自定义指令）是让 Copilot 理解你的项目特点、编码规范和偏好的一种机制。通过编写指令文件，Copilot 可以：

- ✅ 了解项目的技术栈和架构
- ✅ 遵循团队的编码规范
- ✅ 理解构建和测试流程
- ✅ 针对特定文件类型提供定制化建议

### 为什么需要 Custom Instructions？

| 场景 | 没有指令 | 有指令 |
|------|---------|--------|
| 代码风格 | Copilot 可能生成与团队风格不一致的代码 | 自动遵循团队约定的命名、格式规范 |
| 框架版本 | 可能使用最新语法特性 | 知道限制使用特定版本（如 C# 7.3） |
| 构建流程 | 不了解如何构建项目 | 知道使用 `msbuild` 而非 `dotnet build` |
| 安全规范 | 可能忽略安全扫描 | 自动集成 Snyk 等安全检查 |

---

## 2. Instructions 的三个层级

Copilot 支持三个层级的自定义指令，优先级从高到低：

```
┌─────────────────────────────────────────────────┐
│  1️⃣ 个人指令 (Personal Instructions)           │ ← 最高优先级
│     - 仅影响你自己                              │
│     - 在 GitHub.com 上配置                      │
├─────────────────────────────────────────────────┤
│  2️⃣ 仓库指令 (Repository Instructions)         │ ← 本培训重点
│     - 影响所有访问仓库的人                       │
│     - 存储在仓库的 .github 目录                  │
├─────────────────────────────────────────────────┤
│  3️⃣ 组织指令 (Organization Instructions)       │ ← 最低优先级
│     - 影响组织内所有成员                         │
│     - 由组织管理员配置                          │
└─────────────────────────────────────────────────┘
```

> 💡 **提示**：所有层级的指令都会被 Copilot 读取并应用，但如有冲突，高优先级的指令会覆盖低优先级的。

---

## 3. 入门篇：创建仓库级全局指令

### 🎯 目标
创建一个适用于整个仓库的指令文件，让 Copilot 了解项目的基本信息。

### 📍 文件位置
```
项目根目录/
└── .github/
    └── copilot-instructions.md    ← 全局指令文件
```

### 📝 步骤详解

#### 步骤 1：创建 .github 目录（如不存在）

```bash
# Windows
mkdir .github

# Mac/Linux
mkdir -p .github
```

#### 步骤 2：创建 copilot-instructions.md 文件

在 `.github` 目录下创建 `copilot-instructions.md` 文件。

#### 步骤 3：编写指令内容

使用自然语言 + Markdown 格式编写。以下是基本模板：

```markdown
# Copilot Instructions for [项目名称]

## 项目概述
[简要描述项目是什么、做什么用的]

## 技术栈
- 语言：[如 C#、TypeScript]
- 框架：[如 .NET Framework 4.7.2、React 18]
- 数据库：[如 SQL Server]

## 构建指令
- 使用 `[构建命令]` 构建项目
- 使用 `[测试命令]` 运行测试

## 编码规范
- [规范1]
- [规范2]
```

### 📋 实际示例

以下是我们 mynextep 项目的实际 `copilot-instructions.md` 片段：

```markdown
# Copilot Coding Agent Instructions for mynextep Repository

## High-Level Details

### Repository Summary
This repository contains the NEXTEP Gateway, a comprehensive .NET Framework-based 
**food service management system**. It includes multiple C# projects for handling 
restaurant operations, order processing, kitchen communication...

### Repository Information
- **Type**: .NET Framework solution (.sln)
- **Languages**: Primarily C# (for backend logic)
- **Frameworks/Runtimes**: 
  - .NET Framework 4.7.2
  - ASP.NET MVC/Web Forms
  - Entity Framework 6 for data access

## Build Instructions

### Build
1. **Build Solution**: `msbuild mynextep.sln /p:Configuration=Debug`
   - Configurations available: Debug, Release, QA, Prod.
```

### ✅ 全局指令最佳实践

| 应该包含 | 不应该包含 |
|---------|-----------|
| 项目概述和目的 | 具体任务的实现细节 |
| 技术栈版本信息 | 敏感信息（密码、密钥） |
| 构建/测试/运行命令 | 过于冗长的代码示例 |
| 项目结构说明 | 临时性的任务说明 |
| 常见问题和解决方案 | 个人偏好设置 |

> ⚠️ **注意**：指令文件建议控制在 2 页以内，过长的指令可能影响 Copilot 的理解效果。

---

## 4. 进阶篇：创建路径特定指令

### 🎯 目标
为特定类型的文件或目录创建专门的指令，实现更精细化的控制。

### 📍 文件位置
```
项目根目录/
└── .github/
    └── instructions/                    ← 指令目录
        ├── dotnet-framework.instructions.md
        ├── typescript.instructions.md
        └── api-controllers.instructions.md
```

### 📝 步骤详解

#### 步骤 1：创建 instructions 目录

```bash
mkdir .github/instructions
```

#### 步骤 2：创建指令文件

文件命名规则：`[描述性名称].instructions.md`

#### 步骤 3：添加 Frontmatter（前置配置）

每个路径特定指令文件必须以 YAML frontmatter 开头：

```yaml
---
applyTo: "匹配模式"
description: "指令描述（可选）"
---
```

### 🔍 applyTo 模式详解

| 模式 | 说明 | 示例匹配 |
|------|------|---------|
| `*` | 当前目录所有文件 | `file.cs` |
| `**` 或 `**/*` | 所有目录所有文件 | `src/folder/file.cs` |
| `*.cs` | 当前目录所有 .cs 文件 | `Program.cs` |
| `**/*.cs` | 所有目录所有 .cs 文件 | `src/Controllers/HomeController.cs` |
| `src/*.cs` | src 目录下的 .cs 文件（不含子目录） | `src/App.cs` ✅ `src/sub/App.cs` ❌ |
| `src/**/*.cs` | src 目录及子目录下所有 .cs 文件 | `src/sub/deep/App.cs` ✅ |
| `**/*.ts,**/*.tsx` | 多个模式用逗号分隔 | 所有 .ts 和 .tsx 文件 |

### 📋 实际示例

#### 示例 1：.NET Framework 项目指令

```markdown
---
description: 'Guidance for working with .NET Framework projects.'
applyTo: '**/*.csproj, **/*.cs'
---

# .NET Framework Development

## Build Requirements
- Always use `msbuild /t:rebuild` instead of `dotnet build`

## C# Language Version is 7.3
- This project is limited to C# 7.3 features only.

### C# 8.0+ Features (NOT SUPPORTED):
  - Using declarations (`using var stream = ...`)
  - Switch expressions (`variable switch { ... }`)
  - Nullable reference types (`string?`)
  - Range operators (`array[1..^1]`)

## NuGet Package Management
- **Do not attempt to install or update NuGet packages** programmatically
- Ask user to use Visual Studio NuGet Package Manager instead
```

#### 示例 2：安全规则指令

```markdown
---
alwaysApply: true
applyTo: "**"
description: Snyk Security At Inception
---

# Project Security Best Practices

- Always run snyk_code_scan tool for new first party code
- If security issues are found, attempt to fix them using Snyk results
- Rescan the code after fixing issues
- Repeat until no new issues are found
```

#### 示例 3：API Controller 指令

```markdown
---
applyTo: "**/Controllers/**/*.cs"
description: "API Controller development guidelines"
---

# API Controller Guidelines

## Naming Conventions
- Controller classes must end with "Controller"
- Action methods should use HTTP verb prefixes (Get, Post, Put, Delete)

## Required Attributes
- All controllers must have `[ApiController]` attribute
- All actions must have explicit route attributes

## Error Handling
- Use `try-catch` blocks for all database operations
- Return appropriate HTTP status codes
- Log all exceptions using the project's logging framework
```

### 🔧 高级 Frontmatter 选项

```yaml
---
applyTo: "**/*.cs"
description: "C# coding standards"
alwaysApply: true           # 总是应用（不需要匹配文件）
excludeAgent: "code-review" # 排除特定 agent（可选值：code-review, coding-agent）
---
```

---

## 5. 高级篇：Prompt 文件（可复用提示模板）

### 🎯 目标
创建可复用的提示模板，用于常见的开发任务。

> ⚠️ **注意**：Prompt 文件目前仅在 VS Code、Visual Studio 和 JetBrains IDE 中支持。

### 💡 Prompt 文件 vs Instructions 文件

在学习 Prompt 文件之前，先理解它与 Instructions 的区别：

| 对比项 | Instructions | Prompt Files |
|--------|-------------|--------------|
| **作用** | 告诉 Copilot **项目是什么样的** | 告诉 Copilot **要做什么任务** |
| **内容** | 技术栈、版本限制、编码规范 | 任务步骤、检查清单、模板 |
| **应用** | 自动应用到所有 Copilot 请求 | 需要手动选择使用 |
| **示例** | "项目使用 C# 7.3" | "创建单元测试的 5 个步骤" |
| **更新频率** | 较少（项目框架改变时） | 较多（优化工作流程） |

**形象比喻**：
- **Instructions** = 项目的"身份证"（告诉 Copilot 你是谁）
- **Prompt Files** = 任务的"操作手册"（告诉 Copilot 怎么做）

**两者配合使用**：
```
你的请求 → [自动加载 Instructions] + [手动选择 Prompt] → Copilot
            "项目用 .NET Framework"  "按这个清单审查代码"
                                    ↓
                    既符合项目规范，又完成具体任务
```

### 📍 文件位置
```
项目根目录/
└── .github/
    └── prompts/                     ← Prompt 文件目录
        ├── create-unit-test.prompt.md
        ├── code-review.prompt.md
        └── refactor-method.prompt.md
```

### 📝 启用 Prompt 文件（VS Code）

#### 步骤 1：打开工作区设置

按 `Ctrl+Shift+P`（Windows）或 `Cmd+Shift+P`（Mac），输入 "Open Workspace Settings (JSON)"

#### 步骤 2：添加配置

```json
{
    "chat.promptFiles": true
}
```

### 📝 创建 Prompt 文件

#### 方式 1：使用命令面板

1. 按 `Ctrl+Shift+P` / `Cmd+Shift+P`
2. 输入 "Chat: Create Prompt"
3. 输入文件名（不需要 `.prompt.md` 后缀）

#### 方式 2：手动创建

1. 创建 `.github/prompts` 目录
2. 创建 `[名称].prompt.md` 文件

### 📋 Prompt 文件示例

#### 示例 1：创建单元测试

```markdown
# Create Unit Test

请为以下代码创建单元测试：

## 要求
- 使用 xUnit 测试框架
- 遵循 AAA 模式（Arrange, Act, Assert）
- 测试所有公共方法
- 包含边界条件测试
- 包含异常场景测试

## 命名规范
- 测试类：`{被测类名}Tests`
- 测试方法：`{方法名}_When{条件}_Should{期望结果}`

## 目标代码
[在这里粘贴或引用要测试的代码]
```

#### 示例 2：代码审查

```markdown
# Code Review Checklist

请审查以下代码，关注以下方面：

## 代码质量
- [ ] 是否遵循 SOLID 原则
- [ ] 是否有代码重复
- [ ] 命名是否清晰

## 安全性
- [ ] 是否有 SQL 注入风险
- [ ] 是否有敏感信息泄露
- [ ] 输入是否经过验证

## 性能
- [ ] 是否有 N+1 查询问题
- [ ] 是否有不必要的循环
- [ ] 是否正确处理大数据集

请提供改进建议和代码示例。
```

### 🔗 在 Prompt 中引用文件

```markdown
# API Implementation

参考以下规范实现新的 API 端点：

## 参考文档
- API 规范: [api-spec](../../docs/api-spec.md)
- 或使用: #file:../../docs/api-spec.md

## 实现要求
基于上述规范创建相应的 Controller 和 Service
```

### 📝 使用 Prompt 文件

1. 打开 Copilot Chat 面板
2. 点击附件图标（📎）
3. 选择 "Prompt..."
4. 选择要使用的 prompt 文件
5. 根据需要添加额外上下文
6. 发送消息

> 💡 **重要说明**：当你使用 Prompt 文件时，Repository Instructions（copilot-instructions.md 和匹配的 *.instructions.md）仍然会**自动应用**。这意味着：
> - Prompt 文件提供任务的具体要求（如"创建单元测试"）
> - Instructions 提供项目的上下文和约束（如"使用 C# 7.3"、"遵循 xUnit 规范"）
> - 两者叠加使用，让 Copilot 既了解任务又遵循项目规范
>
> **示例**：使用 code-review.prompt.md 时
> ```
> [自动包含] copilot-instructions.md → 项目技术栈、构建方式
> [自动包含] dotnet-framework.instructions.md → C# 版本限制
> [手动选择] code-review.prompt.md → 代码审查检查清单
> [你的输入] 附加的代码文件
>            ↓
>        全面的代码审查（既检查通用问题，又符合项目规范）
> ```


## 6. 高级篇：Agent 指令文件

### 🎯 目标
为 Copilot Coding Agent（编码代理）提供专门的指令。

### 📍 支持的文件

| 文件名 | 位置 | 说明 |
|--------|------|------|
| `AGENTS.md` | 仓库任意位置 | 通用 Agent 指令，最近的文件优先 |
| `CLAUDE.md` | 仓库根目录 | Claude 模型专用指令 |
| `GEMINI.md` | 仓库根目录 | Gemini 模型专用指令 |

### 📋 AGENTS.md 示例

```markdown
# Agent Instructions

## 代码修改规则
- 在修改代码前，先理解现有代码的上下文
- 保持与现有代码风格一致
- 每次修改后运行相关测试

## 提交规范
- 使用 Conventional Commits 格式
- 每个提交只包含一个逻辑修改
- 提交消息使用英文

## 禁止操作
- 不要删除或修改配置文件
- 不要更改项目结构
- 不要引入新的依赖（除非明确要求）
```

### 💡 AGENTS.md vs copilot-instructions.md

| 特性 | copilot-instructions.md | AGENTS.md |
|------|------------------------|-----------|
| 用途 | 通用 Copilot 指令 | Coding Agent 专用 |
| 位置 | 必须在 `.github` 目录 | 可以在任意目录 |
| 继承 | 全局适用 | 最近的文件优先 |
| 支持场景 | Chat、Code Review、Agent | 主要用于 Agent |

---

## 7. 最佳实践与常见场景

### 📁 推荐的目录结构

```
项目根目录/
├── .github/
│   ├── copilot-instructions.md           # 全局指令
│   ├── instructions/                      # 路径特定指令
│   │   ├── dotnet-framework.instructions.md
│   │   ├── frontend.instructions.md
│   │   ├── database.instructions.md
│   │   └── security.instructions.md
│   └── prompts/                           # 可复用提示（可选）
│       ├── create-unit-test.prompt.md
│       └── code-review.prompt.md
├── AGENTS.md                              # Agent 指令（可选）
└── src/
    └── ...
```

### 🎯 常见场景指令示例

#### 场景 1：多语言项目

```markdown
---
applyTo: "**/*.py"
---
# Python Development

- 使用 Python 3.9+ 语法
- 遵循 PEP 8 代码风格
- 使用 type hints
- 使用 pytest 进行测试
```

```markdown
---
applyTo: "**/*.ts,**/*.tsx"
---
# TypeScript Development

- 使用 strict mode
- 优先使用 interface 而非 type
- 使用 functional components
- 使用 React hooks
```

#### 场景 2：数据库相关

```markdown
---
applyTo: "**/Database/**/*.sql"
---
# SQL Development

- 所有表名使用 PascalCase
- 所有列名使用 camelCase
- 必须包含 CreatedDate 和 ModifiedDate 列
- 使用参数化查询防止 SQL 注入
```

#### 场景 3：API 开发

```markdown
---
applyTo: "**/Controllers/**/*.cs, **/API/**/*.cs"
---
# API Development Guidelines

## RESTful 规范
- GET: 获取资源
- POST: 创建资源
- PUT: 更新完整资源
- PATCH: 部分更新
- DELETE: 删除资源

## 响应格式
- 成功响应返回 200/201/204
- 客户端错误返回 4xx
- 服务器错误返回 5xx
- 统一使用 JSON 格式
```

### ⚠️ 常见错误

| 错误 | 正确做法 |
|------|---------|
| 指令文件过长（超过 2 页） | 拆分为多个路径特定指令 |
| 包含敏感信息 | 使用环境变量或配置文件引用 |
| 指令过于具体（针对单一任务） | 保持通用性，使用 prompt 文件处理特定任务 |
| frontmatter 格式错误 | 确保 YAML 语法正确，使用正确的引号 |
| 文件名不以 .instructions.md 结尾 | 必须使用 `.instructions.md` 后缀 |

---

## 8. 验证指令是否生效

### VS Code 中验证

1. **打开 Copilot Chat**
2. **发送一个问题**
3. **查看 References（引用）列表**

如果指令被应用，你会在响应上方看到引用的指令文件：

```
References: .github/copilot-instructions.md, .github/instructions/dotnet-framework.instructions.md
```

### 启用/禁用指令

#### VS Code 设置

1. 打开设置（`Ctrl+,`）
2. 搜索 "instruction file"
3. 勾选或取消 "Code Generation: Use Instruction Files"

#### GitHub.com 仓库设置

1. 进入仓库 Settings
2. 找到 "Code & automation" → "Copilot"
3. 切换 "Use custom instructions" 选项

---

## 9. 常见问题解答

### Q1: 指令文件不生效怎么办？

**检查清单：**
- [ ] 文件位置是否正确（`.github/` 目录）
- [ ] 文件名是否正确（`copilot-instructions.md` 或 `*.instructions.md`）
- [ ] frontmatter 语法是否正确
- [ ] VS Code 设置是否启用了 instruction files
- [ ] 文件是否已保存

### Q2: 多个指令文件冲突怎么办？

Copilot 会综合考虑所有适用的指令。如果有明确冲突，优先级为：
1. 个人指令
2. 仓库指令
3. 组织指令

建议：避免在不同文件中设置相互矛盾的规则。

### Q3: 指令文件多大合适？

**推荐：**
- 全局指令：1-2 页
- 路径特定指令：半页到 1 页
- 总体原则：简洁、明确、可操作

### Q4: 可以在指令中引用其他文件吗？

在 `copilot-instructions.md` 和 `*.instructions.md` 中：
- 可以使用 Markdown 链接引用其他文档
- Copilot 不会自动读取链接的文件内容

在 `.prompt.md` 文件中：
- 可以使用 `#file:path/to/file` 语法引用文件
- Copilot 会读取引用的文件内容

### Q5: 如何为不同分支设置不同指令？

指令文件是仓库的一部分，不同分支可以有不同的指令内容。Copilot 会使用当前分支的指令文件。

### Q6: 使用 Prompt 文件时，Instructions 还会生效吗？

**会的！** Instructions 和 Prompt 文件是互补的，不是互斥的：

| 文件类型 | 应用方式 | 作用 | 示例 |
|---------|---------|------|------|
| **Instructions** | 自动应用 | 提供项目上下文和通用规范 | "使用 C# 7.3"、"用 msbuild 构建" |
| **Prompt Files** | 手动选择 | 提供特定任务的详细要求 | "创建单元测试的步骤" |

**实际场景**：
```
你有这些文件：
- .github/copilot-instructions.md (项目是 .NET Framework)
- .github/instructions/testing.instructions.md (使用 xUnit)
- .github/prompts/create-test.prompt.md (单元测试模板)

当你使用 create-test.prompt.md 时：
✅ copilot-instructions.md → 自动应用
✅ testing.instructions.md → 自动应用（如果匹配当前文件）
✅ create-test.prompt.md → 手动选择使用

结果：Copilot 生成的测试符合项目框架要求（.NET Framework + xUnit），
    并遵循你 prompt 中的具体结构要求
```

**最佳实践**：
- Instructions：写项目的**通用规则**（技术栈、版本限制、编码规范）
- Prompt：写**具体任务**的详细步骤（如何创建测试、如何审查代码）


## 10. 实战练习

### 练习 1：创建你的第一个全局指令（5分钟）

1. 在你的项目中创建 `.github/copilot-instructions.md`
2. 添加以下内容（根据你的项目调整）：

```markdown
# Copilot Instructions

## 项目概述
[描述你的项目]

## 技术栈
- [列出主要技术]

## 编码规范
- 使用 [语言版本]
- 遵循 [编码风格]
```

3. 保存文件，打开 Copilot Chat 测试

### 练习 2：创建路径特定指令（10分钟）

1. 创建 `.github/instructions/` 目录
2. 根据你的项目创建一个指令文件，例如：

```markdown
---
applyTo: "**/*.cs"
description: "C# coding standards for our project"
---

# C# Development Guidelines

[添加你的团队编码规范]
```

3. 测试指令是否对相关文件生效

### 练习 3：创建 Prompt 模板（15分钟）

1. 在 VS Code 工作区设置中启用 `"chat.promptFiles": true`
2. 创建 `.github/prompts/code-review.prompt.md`
3. 编写一个代码审查模板
4. 在 Copilot Chat 中测试使用该 prompt

---

## 📚 参考资源

- [GitHub 官方文档 - Configure Custom Instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions)
- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/customization)
- [Awesome GitHub Copilot Customizations](https://github.com/github/awesome-copilot)
- [Custom Instructions Examples Library](https://docs.github.com/en/copilot/tutorials/customization-library/custom-instructions)

---

## 📝 培训总结

| 类型 | 文件位置 | 用途 | 难度 |
|------|---------|------|------|
| 全局指令 | `.github/copilot-instructions.md` | 项目整体信息 | ⭐ 入门 |
| 路径特定指令 | `.github/instructions/*.instructions.md` | 特定文件类型规范 | ⭐⭐ 进阶 |
| Prompt 文件 | `.github/prompts/*.prompt.md` | 可复用任务模板 | ⭐⭐⭐ 高级 |
| Agent 指令 | `AGENTS.md` / `CLAUDE.md` | Coding Agent 专用 | ⭐⭐⭐ 高级 |

**记住核心原则：**
1. 指令应该简洁、明确、可操作
2. 使用路径特定指令实现精细化控制
3. 定期更新指令以反映项目变化
4. 避免在指令中包含敏感信息

---

*祝你使用 Copilot Custom Instructions 愉快！如有问题，欢迎讨论。* 🚀
