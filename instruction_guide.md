# GitHub Copilot Instructions 使用指南

## 什么是 Instruction Files？

Instruction Files（指令文件）是用来指导 AI 如何编写代码的规则文件。它们确保 AI 生成的代码符合项目的编码规范、安全标准和最佳实践。

## 一、基本语法结构

### 完整格式

```markdown
---
alwaysApply: true          # 是否总是应用此指令
always_on: true            # 是否始终启用
trigger: always_on         # 触发条件
applyTo: "**"             # 应用范围（文件模式）
description: 描述信息      # 指令的简短描述
---

# 指令标题

- 规则1：具体的编码规范
- 规则2：错误处理要求
- 规则3：文档注释标准
```

### 关键字段说明

| 字段 | 说明 | 可选值 | 示例 |
|------|------|--------|------|
| `alwaysApply` | 是否无条件应用 | `true`/`false` | `true` |
| `always_on` | 是否始终启用 | `true`/`false` | `true` |
| `trigger` | 触发机制 | `always_on`, `on_demand` | `always_on` |
| `applyTo` | 文件匹配模式（glob） | glob 模式 | `"**"`, `"*.js"`, `"src/**/*.ts"` |
| `description` | 指令用途描述 | 字符串 | `"Code style guidelines"` |

## 二、优先级规则

### 优先级顺序（从高到低）

1. **特定文件模式的指令** 
   - 例如：`applyTo: "src/api/**/*.js"`
   - 针对特定文件的规则优先级最高

2. **通用指令**
   - 例如：`applyTo: "**"`
   - 应用于所有文件的基础规则

3. **叠加规则**
   - 多个指令同时生效时，规则会**叠加应用**
   - 更具体的规则会**补充或覆盖**通用规则

### 示例场景

```
项目结构：
├── .github/instructions/
│   ├── code_style.instructions.md      (applyTo: "**")
│   ├── security.instructions.md         (applyTo: "**")
│   └── api_rules.instructions.md        (applyTo: "src/api/**")
└── src/
    └── api/
        └── user.js  ← 会应用所有三个指令
```

## 三、实际代码对比

### 用户指令

假设用户给出以下请求：

> **Create a JavaScript function that calculates the area of a circle**

下面对比 AI 在有/无 instruction 文件的情况下生成的代码差异。

### ✅ 有 Instruction 的代码示例

基于 `code_style.instructions.md` 规则生成：

```javascript
/**
 * Calculates the area of a circle given its radius.
 * 
 * The function uses the formula: A = π * r²
 * where A is the area and r is the radius.
 * 
 * @param {number} radius - The radius of the circle (must be non-negative)
 * @returns {number} The calculated area of the circle
 * @throws {Error} If the radius is negative
 * 
 * @example
 * const area = calculateCircleArea(5);
 * console.log(area); // 78.53981633974483
 */
function calculateCircleArea(radius) {
  // Validate input: radius must be non-negative
  if (radius < 0) {
    throw new Error('Radius cannot be negative');
  }

  // Calculate area using the formula: A = π * r²
  return Math.PI * radius * radius;
}

// Usage examples
const smallCircle = calculateCircleArea(5);
console.log('Area of circle with radius 5:', smallCircle);

const largeCircle = calculateCircleArea(10);
console.log('Area of circle with radius 10:', largeCircle);

module.exports = calculateCircleArea;
```

**特点：**
- ✅ JSDoc 完整注释
- ✅ 2 个空格缩进
- ✅ 驼峰命名法（camelCase）
- ✅ 单引号字符串
- ✅ 输入验证
- ✅ 使用示例
- ✅ 每行不超过 80 字符
- ✅ 有意义的变量名
- ✅ 分号结尾

### ❌ 没有 Instruction 的代码示例

随机生成，无统一规范：

```javascript
function calculate_circle_area(radius){
    if(radius<0){
        throw new Error("Radius cannot be negative")
    }
    return Math.PI*radius*radius
}

let area=calculate_circle_area(5)
console.log(area)
```

**问题：**
- ❌ 无文档注释
- ❌ 4 个空格或 tab 缩进（不一致）
- ❌ 下划线命名法（snake_case）
- ❌ 双引号字符串
- ❌ 缺少输入验证说明
- ❌ 无使用示例
- ❌ 关键字后无空格（`if(`）
- ❌ 运算符周围无空格（`radius<0`）
- ❌ 缺少分号

## 四、影响对比表

| 方面 | 有 Instruction | 无 Instruction |
|------|---------------|---------------|
| **代码风格** | 统一、一致 | 随机、不一致 |
| **可读性** | 高（有完整注释） | 低（缺少文档） |
| **注释规范** | 标准 JSDoc 格式 | 可能缺少或格式混乱 |
| **错误处理** | 标准化验证和异常 | 可能遗漏或不规范 |
| **命名规范** | 遵循团队约定 | 每次可能不同 |
| **安全性** | 自动扫描（如 snyk） | 无自动检查 |
| **可维护性** | 高（易于理解和修改） | 低（需人工统一） |
| **团队协作** | 易于多人协作 | 困难（风格冲突） |
| **代码审查** | 减少格式讨论 | 增加审查负担 |

## 五、常见 Instruction 模板

### 1. 代码风格指令

```markdown
---
alwaysApply: true
applyTo: "**/*.js"
description: JavaScript code style guidelines
---

# JavaScript Code Style

- Use 2 spaces for indentation
- Use camelCase for variables and functions
- Use single quotes for strings
- Add JSDoc comments for functions
- Limit lines to 80 characters
```

### 2. 安全规则指令

```markdown
---
alwaysApply: true
trigger: always_on
applyTo: "**"
description: Security best practices
---

# Project Security Best Practices

- Always run security scan for new code
- Validate all user inputs
- Use parameterized queries for database
- Never log sensitive information
```

### 3. 特定功能指令

```markdown
---
applyTo: "src/api/**/*.js"
description: API endpoint specific rules
---

# API Development Rules

- All endpoints must have error handling
- Use async/await for asynchronous operations
- Return consistent response format
- Include request validation middleware
```

### 4. 测试文件指令

```markdown
---
applyTo: "**/*.test.js"
description: Testing standards
---

# Testing Standards

- Use describe/it structure
- Include setup and teardown
- Test edge cases
- Aim for 80%+ code coverage
```

## 六、最佳实践

### 1. 文件组织

```
.github/
└── instructions/
    ├── code_style.instructions.md       # 通用代码风格
    ├── security.instructions.md          # 安全规范
    ├── api_rules.instructions.md         # API 特定规则
    └── test_rules.instructions.md        # 测试规范
```

### 2. 指令编写建议

- **明确具体**：规则要清晰、可执行
- **合理分组**：相关规则放在同一文件
- **适度详细**：提供足够的示例和说明
- **保持更新**：随项目演进更新规则
- **团队共识**：确保团队成员认可规则

### 3. 使用场景

| 场景 | 推荐 Instruction |
|------|-----------------|
| 新项目初始化 | 创建基础代码风格指令 |
| 多人协作 | 添加统一的命名和格式规范 |
| 安全要求高 | 添加安全扫描和验证指令 |
| API 开发 | 创建 API 特定的错误处理规范 |
| 开源项目 | 添加贡献指南相关指令 |

## 七、本项目的 Instruction 文件

当前项目包含以下指令文件：

1. **code_style.instructions.md**
   - 作用：统一代码风格
   - 范围：所有文件 (`applyTo: "**"`)
   - 示例：2 空格缩进、驼峰命名等

2. **snyk_rules.instructions.md**
   - 作用：确保代码安全
   - 范围：所有文件 (`applyTo: "**"`)
   - 功能：自动扫描新代码的安全问题

## 八、总结

### Instruction Files 的价值

- 📝 **统一标准**：确保团队代码风格一致
- 🔒 **提升安全**：自动化安全检查和验证
- 🚀 **提高效率**：减少代码审查中的格式讨论
- 🤝 **改善协作**：新成员快速适应项目规范
- 🎯 **保证质量**：AI 生成的代码自动符合标准

### 关键要点

> Instruction Files 就像给 AI 制定的"编码规范手册"，确保生成的代码质量稳定、风格统一、符合项目标准。无论是人工编写还是 AI 生成，都能保持一致的高质量代码。

---

**创建日期：** 2026-01-19  
**适用版本：** GitHub Copilot with Claude Sonnet 4.5
