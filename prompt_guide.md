# GitHub Copilot Prompt Files 使用指南

## 文档概述

本指南将帮助你掌握 GitHub Copilot 的 `.prompt` 文件功能——一种创建可重用、参数化提示词模板的强大工具。通过 Prompt Files，你可以将常用的 AI 交互模式标准化，提升团队协作效率。

### 适用人群

- ✅ 需要频繁执行相似任务的开发者
- ✅ 希望标准化团队 AI 工作流的技术负责人
- ✅ 想要创建可复用提示词模板的项目成员
- ✅ 对提升 Copilot 使用效率感兴趣的学习者

### 学习路径

```
理解 Prompt Files 概念 → 学习基本语法 → 实践创建模板 → 掌握参数化 → 团队共享
```

**建议阅读时间：** 30-45 分钟 | **实践时间：** 1-2 小时

---

## 目录

- [什么是 Prompt Files？](#什么是-prompt-files)
- [一、基本语法结构](#一基本语法结构)
- [二、Prompt Files 的核心组成](#二prompt-files-的核心组成)
- [三、实际案例分析](#三实际案例分析)
- [四、参数化与变量](#四参数化与变量)
- [五、常见 Prompt File 模板](#五常见-prompt-file-模板)
- [六、与其他功能的对比](#六与其他功能的对比)
- [七、最佳实践](#七最佳实践)
- [八、常见问题与故障排除](#八常见问题与故障排除)
- [九、总结](#九总结)

---

## 什么是 Prompt Files？

Prompt Files（提示词文件）是 GitHub Copilot 中用于创建可重用、参数化提示词模板的 `.prompt` 文件。它们允许你将复杂的、常用的 AI 指令封装成简单的命令，团队成员可以通过 `/` 命令快速调用。

### 核心概念

```
重复的手动输入 → 封装为 .prompt 文件 → 一键调用
复杂的指令      → 参数化模板       → 灵活复用  
团队知识        → 标准化 Prompts   → 协作增效
```

### Prompt Files 的特点

- 🎯 **可重用**：一次编写，多次使用
- 📝 **参数化**：支持变量和占位符
- 🤝 **可共享**：团队成员共同使用
- 🔧 **可维护**：集中管理，统一更新
- 📦 **模块化**：组合使用，灵活搭配

### 为什么需要 Prompt Files？

| 场景 | 传统方式 💭 | 使用 Prompt Files 🚀 |
|------|-----------|---------------------|
| **代码审查** | 每次手动输入长指令 | `/code-review` 一键调用 |
| **生成测试** | 重复描述测试要求 | `/generate-tests` 参数化生成 |
| **文档编写** | 多次说明文档格式 | `/api-doc` 标准化输出 |
| **团队协作** | 口头传达最佳实践 | 共享 `.prompt` 文件 |
| **知识沉淀** | 个人经验难以传承 | 团队 Prompt 库 |

### 工作原理

```
┌─────────────────────────────────────────────────────────────┐
│  用户在 Copilot Chat 中输入：                                │
│  /generate-api-test UserController getUserById              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Copilot 查找并加载：                                        │
│  .github/prompts/generate-api-test.prompt                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  替换参数变量：                                              │
│  {{controller}} → UserController                            │
│  {{method}} → getUserById                                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  执行完整的 Prompt 指令：                                    │
│  "为 UserController 的 getUserById 方法生成集成测试..."     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  返回生成的测试代码 ✓                                       │
└─────────────────────────────────────────────────────────────┘
```

## 一、基本语法结构

### 文件位置与命名

```
项目根目录/
├── .github/
│   └── prompts/
│       ├── code-review.prompt           # 代码审查
│       ├── generate-tests.prompt        # 生成测试
│       ├── api-documentation.prompt     # API 文档
│       └── refactor-code.prompt         # 代码重构
```

**命名规则：**
- 文件必须以 `.prompt` 结尾
- 使用短横线分隔（kebab-case）
- 名称应清晰表达用途
- 文件名即为调用命令（/文件名）

### 基本格式

```markdown
---
name: prompt-name
description: 简短描述这个 prompt 的用途
params:
  - name: param1
    description: 参数1的说明
  - name: param2
    description: 参数2的说明
---

这里是 prompt 的主体内容。

可以使用 {{param1}} 和 {{param2}} 来引用参数。

支持多行文本，Markdown 格式，以及详细的指令。
```

### 完整示例

```markdown
---
name: generate-unit-test
description: 为指定的函数生成单元测试
params:
  - name: function_name
    description: 要测试的函数名称
  - name: test_framework
    description: 测试框架（如 Jest, Mocha, Pytest）
---

为函数 `{{function_name}}` 生成完整的单元测试。

**测试框架：** {{test_framework}}

**要求：**
1. 包含正常路径测试用例
2. 包含边界条件测试
3. 包含错误情况测试
4. 使用 AAA（Arrange-Act-Assert）模式
5. 添加清晰的测试描述

**输出格式：**
- 完整的测试文件
- 包含必要的 imports
- 每个测试用例有清晰的注释
```

### 调用方式

```bash
# 在 Copilot Chat 中
/generate-unit-test calculateTotalPrice Jest

# 等价于手动输入：
# "为函数 calculateTotalPrice 生成完整的单元测试..."
```

## 二、Prompt Files 的核心组成

### 1. Frontmatter（元数据）

使用 YAML 格式定义 prompt 的元信息：

```yaml
---
name: prompt-identifier          # 必需：prompt 的唯一标识符
description: '简短描述'           # 必需：用途说明
params:                          # 可选：参数定义列表
  - name: param_name            # 参数名称
    description: '参数用途'      # 参数说明
    required: true               # 是否必需（默认 false）
    default: 'default_value'     # 默认值（可选）
---
```

**字段说明：**

| 字段 | 说明 | 是否必需 | 示例 |
|------|------|---------|------|
| `name` | Prompt 唯一标识符 | ✅ 必需 | `code-review` |
| `description` | 简短用途说明 | ✅ 必需 | `'Performs code review'` |
| `params` | 参数列表 | ❌ 可选 | 见下文 |
| `params[].name` | 参数名称 | ✅ 必需（如有params） | `file_path` |
| `params[].description` | 参数说明 | ✅ 必需（如有params） | `'File to review'` |
| `params[].required` | 是否必需 | ❌ 可选 | `true` |
| `params[].default` | 默认值 | ❌ 可选 | `'main.js'` |

### 2. Prompt 主体内容

Frontmatter 之后的所有内容都是 prompt 的主体：

```markdown
---
name: example
description: 示例 prompt
params:
  - name: input
---

这里是 prompt 的主体内容。

**可以使用：**
- Markdown 格式
- 多行文本
- {{参数引用}}
- 详细的指令和要求

支持所有 Markdown 语法：
- 列表
- 代码块
- 表格
- 等等...
```

### 3. 参数引用

在主体中使用 `{{param_name}}` 引用参数：

```markdown
---
name: create-component
params:
  - name: component_name
  - name: component_type
---

创建一个 React {{component_type}} 组件，名为 {{component_name}}。

**组件要求：**
- 文件名：{{component_name}}.jsx
- 组件类型：{{component_type}}
- 导出方式：export default {{component_name}}
```

## 三、实际案例分析

### 案例 1：代码审查 Prompt

#### 文件：`.github/prompts/code-review.prompt`

```markdown
---
name: code-review
description: 执行全面的代码审查，检查最佳实践、性能和安全问题
params:
  - name: focus_area
    description: 审查重点（performance, security, readability, all）
    default: 'all'
---

对当前选中的代码进行专业的代码审查。

**审查重点：** {{focus_area}}

**审查维度：**

1. **🐛 潜在问题**
   - 逻辑错误
   - 边界条件处理
   - 错误处理是否完善

2. **🚀 性能优化**
   - 算法复杂度
   - 不必要的计算
   - 内存使用

3. **🔒 安全检查**
   - 输入验证
   - SQL 注入风险
   - XSS 漏洞
   - 敏感信息泄露

4. **📖 可读性**
   - 命名是否清晰
   - 代码结构是否合理
   - 注释是否充分

5. **✨ 最佳实践**
   - 是否遵循设计模式
   - 是否符合项目规范
   - 可测试性

**输出格式：**
对每个发现的问题：
- **问题：** [描述]
- **严重程度：** [高/中/低]
- **建议：** [具体改进方案]
- **代码示例：** [改进后的代码]

最后提供总体评分（1-10）和改进优先级。
```

#### 使用示例

```bash
# 全面审查
/code-review all

# 专注性能
/code-review performance

# 专注安全
/code-review security
```

### 案例 2：代码解释 Prompt

#### 文件：`.github/prompts/explain-code.prompt`

这是一个真实的、经过实践验证的代码解释 prompt，展示了如何通过参数化和结构化输出来创建高质量的代码说明文档。

```markdown
---
name: explain-code
description: Provide clear, in-depth code explanations for developers at different skill levels
params:
  - name: audience_level
    description: Target audience skill level (beginner, intermediate, advanced)
    default: 'intermediate'
---

Provide a clear and comprehensive explanation of the selected code.

**Target Audience:** {{audience_level}}

**Explanation Requirements:**

1. **📋 Code Overview**
   - What is the main functionality of this code?
   - What problem does it solve?
   - What role does it play in the project?

2. **🔍 Step-by-Step Breakdown**
   - Break down main components or functions in execution order
   - Explain the purpose of each key step
   - Describe how data flows through the code

3. **💡 Key Concepts**
   - Explain technical terms used in the code
   - Describe design patterns or programming paradigms
   - Explain why it's designed this way

4. **🎯 Usage Examples**
   - How to call or use this code
   - Meaning and types of input parameters
   - Expected output or behavior

5. **⚠️ Important Notes**
   - Potential pitfalls or common mistakes
   - Performance considerations
   - Edge cases and error handling

6. **🚀 Practical Applications**
   - Common use cases
   - When to use this code
   - Possible extensions or improvements

**Output Style:**
- Use clear, concise language
- Adjust technical depth based on {{audience_level}}
- Avoid unnecessary jargon
- Include code comments and examples
- Use Markdown formatting for readability
```

#### 使用示例

```bash
# 场景1：为初学者解释复杂的验证逻辑
/explain-code beginner
# 选中代码：EmailDomainSettings 类
# 输出：详细的、避免术语的说明，包含大量示例

# 场景2：为团队成员快速说明API设计
/explain-code intermediate
# 选中代码：REST API 控制器方法
# 输出：平衡深度的解释，关注设计决策

# 场景3：为高级开发者分析性能优化
/explain-code advanced
# 选中代码：缓存实现逻辑
# 输出：深入的技术分析，包含优化建议和权衡讨论
```

#### 设计亮点

1. **参数化灵活性**：通过 `audience_level` 参数适应不同技术水平的读者
2. **结构化输出**：6 个维度确保解释的全面性和一致性
3. **视觉增强**：使用 emoji 图标使内容更易扫描
4. **明确的输出指南**：确保 AI 生成的内容符合预期格式
5. **实用导向**：不仅解释"是什么"，还说明"为什么"和"如何用"

#### 实际效果对比

| 传统方式 | 使用 explain-code Prompt |
|---------|------------------------|
| 手动编写解释文档耗时 1-2 小时 | 5 分钟生成初稿，15 分钟审校 |
| 不同人写的文档风格不一致 | 标准化的结构和风格 |
| 容易遗漏边界情况和陷阱 | 系统化地覆盖 6 个维度 |
| 难以调整技术深度 | 一个参数即可切换受众 |

### 案例 3：API 测试生成 Prompt

#### 文件：`.github/prompts/generate-api-test.prompt`

```markdown
---
name: generate-api-test
description: 为 REST API 端点生成集成测试
params:
  - name: endpoint
    description: API 端点路径（如 /api/users/:id）
    required: true
  - name: method
    description: HTTP 方法（GET, POST, PUT, DELETE）
    required: true
  - name: auth_required
    description: 是否需要认证（yes/no）
    default: 'yes'
---

为以下 API 端点生成完整的集成测试：

**端点：** {{method}} {{endpoint}}
**认证：** {{auth_required}}

**测试覆盖：**

1. **成功场景（2xx）**
   - 有效请求返回正确数据
   - 响应格式验证
   - 响应时间检查

2. **客户端错误（4xx）**
   - 无效参数处理
   - 缺少必需字段
   - 格式错误
   - 认证失败（如适用）
   - 权限不足（如适用）

3. **服务器错误（5xx）**
   - 异常处理
   - 超时处理

4. **边界测试**
   - 空值处理
   - 极限值测试
   - 特殊字符处理

**技术要求：**
- 使用 Jest + Supertest
- 每个测试独立（使用 beforeEach/afterEach）
- Mock 外部服务调用
- 清晰的测试描述
- 添加测试数据 setup

**输出：**
完整的测试文件，可以直接运行。
```

#### 使用示例

```bash
/generate-api-test /api/users/:id GET yes
/generate-api-test /api/products POST no
```

## 四、参数化与变量

### 1. 基本参数使用

```markdown
---
name: create-function
params:
  - name: function_name
  - name: param1
  - name: param2
---

创建一个函数 {{function_name}}，接收参数：{{param1}} 和 {{param2}}
```

### 2. 必需参数 vs 可选参数

```markdown
---
name: example
params:
  - name: required_param
    required: true          # 必需参数
  - name: optional_param
    required: false         # 可选参数
    default: 'default'      # 提供默认值
---

必需参数：{{required_param}}
可选参数：{{optional_param}}
```

### 3. 多参数组合

```markdown
---
name: create-crud
params:
  - name: model_name
  - name: fields
  - name: database
  - name: framework
---

为 {{model_name}} 创建完整的 CRUD 操作。

**配置：**
- 模型名：{{model_name}}
- 字段：{{fields}}
- 数据库：{{database}}
- 框架：{{framework}}

根据以上配置生成：
1. 数据库模型定义
2. CRUD API 端点
3. 输入验证
4. 错误处理
5. 基本测试
```

## 五、常见 Prompt File 模板

### 1. 代码生成类

```markdown
---
name: generate-component
description: 生成React组件模板
params:
  - name: component_name
    required: true
  - name: component_type
    description: 'functional 或 class'
    default: 'functional'
---

生成 React {{component_type}} 组件：{{component_name}}

**要求：**
- 使用 TypeScript
- 包含 PropTypes/TypeScript 接口
- 添加 JSDoc 注释
- 导出语句

**文件结构：**
```
components/
├── {{component_name}}/
│   ├── {{component_name}}.tsx
│   ├── {{component_name}}.test.tsx
│   └── index.ts
```

生成所有必要的文件。
```

### 2. 测试类

```markdown
---
name: test-coverage
description: 为现有代码生成测试用例以提高覆盖率
params:
  - name: target_coverage
    description: '目标覆盖率百分比'
    default: '80'
---

分析当前代码的测试覆盖率，并生成测试用例以达到 {{target_coverage}}% 覆盖率。

**分析步骤：**
1. 识别未覆盖的代码路径
2. 找出边界条件
3. 识别错误处理分支

**生成测试：**
- 单元测试
- 集成测试（如需要）
- 边界条件测试
- 错误场景测试

**输出：**
- 测试文件
- 覆盖率报告
- 建议的改进
```

### 3. 代码解释类

```markdown
---
name: explain-code
description: Provide clear, in-depth code explanations for developers at different skill levels
params:
  - name: audience_level
    description: Target audience skill level (beginner, intermediate, advanced)
    default: 'intermediate'
---

Provide a clear and comprehensive explanation of the selected code.

**Target Audience:** {{audience_level}}

**Explanation Requirements:**

1. **📋 Code Overview**
   - What is the main functionality of this code?
   - What problem does it solve?
   - What role does it play in the project?

2. **🔍 Step-by-Step Breakdown**
   - Break down main components or functions in execution order
   - Explain the purpose of each key step
   - Describe how data flows through the code

3. **💡 Key Concepts**
   - Explain technical terms used in the code
   - Describe design patterns or programming paradigms
   - Explain why it's designed this way

4. **🎯 Usage Examples**
   - How to call or use this code
   - Meaning and types of input parameters
   - Expected output or behavior

5. **⚠️ Important Notes**
   - Potential pitfalls or common mistakes
   - Performance considerations
   - Edge cases and error handling

6. **🚀 Practical Applications**
   - Common use cases
   - When to use this code
   - Possible extensions or improvements

**Output Style:**
- Use clear, concise language
- Adjust technical depth based on {{audience_level}}
- Avoid unnecessary jargon
- Include code comments and examples
- Use Markdown formatting for readability
```

#### 使用示例

```bash
# 为初学者解释代码
/explain-code beginner

# 为中级开发者解释（默认）
/explain-code

# 为高级开发者提供深度分析
/explain-code advanced
```

**参数设计最佳实践（来自 explain-code.prompt 实例）：**

```yaml
# 优秀案例：audience_level 参数
params:
  - name: audience_level                           # ✅ 语义清晰
    description: Target audience skill level       # ✅ 说明用途
                 (beginner, intermediate, advanced) # ✅ 列出可选值
    default: 'intermediate'                        # ✅ 合理的默认值
```

**为什么这个参数设计优秀？**
1. **命名清晰**：`audience_level` 明确表达了参数的含义
2. **详细说明**：不仅说明用途，还列出了有效值
3. **默认值合理**：`intermediate` 是最常见的使用场景
4. **灵活性**：支持三种不同的使用模式，覆盖广泛需求

#### 实际应用场景

这个 prompt 特别适合用于：
- 📚 **代码审查会议**：快速生成详细的代码说明文档
- 🎓 **团队培训**：为新成员解释复杂代码逻辑
- 📝 **文档编写**：自动生成代码文档的基础内容
- 🔍 **代码理解**：分析第三方库或遗留代码
- 💡 **知识传承**：将核心代码的设计思路文档化

## 六、与其他功能的对比

### Prompt Files vs Instruction Files vs Custom Agents

| 特性 | Prompt Files 📝 | Instruction Files 📋 | Custom Agents 🤖 |
|------|----------------|---------------------|-----------------|
| **用途** | 创建可重用的提示词模板 | 定义代码生成规则 | 创建专业化 AI 助手 |
| **调用方式** | `/prompt-name` 显式调用 | 自动应用到匹配文件 | `@agent-name` 调用 |
| **参数化** | ✅ 支持参数 | ❌ 不支持 | ❌ 不直接支持 |
| **文件位置** | `.github/prompts/` | `.github/instructions/` | `.github/agents/` |
| **文件扩展名** | `.prompt` | `.instructions.md` | `.agent.md` |
| **应用场景** | 重复性任务，需要参数 | 代码风格，安全规范 | 特定领域专家 |
| **团队共享** | ✅ 是 | ✅ 是 | ✅ 是 |

### 使用场景对比

```markdown
**使用 Prompt Files 的场景：**
✅ 需要参数化的重复性任务
✅ 生成测试、文档、组件等
✅ 代码审查、重构等标准流程
✅ 团队实践案例：从 explain-code.prompt 学到的经验

在实际项目中使用 `explain-code.prompt` 后，我们总结了以下最佳实践：

#### ✅ **结构化输出要求**
```markdown
# explain-code.prompt 使用了 6 个明确的维度
1. 📋 Code Overview
2. 🔍 Step-by-Step Breakdown
3. 💡 Key Concepts
4. 🎯 Usage Examples
5. ⚠️ Important Notes
6. 🚀 Practical Applications

# 这种结构确保：
- AI 输出的完整性
- 文档的一致性
- 易于扫描和理解
```

#### ✅ **使用 Emoji 增强可读性**
```markdown
# 好的做法
1. **📋 Code Overview**
   - Clear visual hierarchy
   - Easy to scan

# 避免过度使用
❌ 不要在每个句子都加 emoji，只在标题使用
```

#### ✅ **明确的输出风格指南**
```markdown
**Output Style:**
- Use clear, concise language
- Adjust technical depth based on {{audience_level}}
- Avoid unnecessary jargon
- Include code comments and examples

# 这些指南帮助 AI 生成更符合预期的内容
```

#### ✅ **参数驱动的灵活性**
```markdown
# 一个参数，三种用法
/explain-code beginner      # 详细解释，避免术语
/explain-code intermediate  # 平衡的深度
/explain-code advanced      # 深入分析，性能讨论
```

### 需要统一的工作方式

**使用 Instruction Files 的场景：**
✅ 统一代码风格
✅ 安全规范自动应用
✅ 项目级别的编码标准
✅ 自动化的规则检查

**使用 Custom Agents 的场景：**
✅ 特定领域的专家助手
✅ 限定工具访问权限
✅ 特殊的工作流程
✅ 明确的职责边界
```

## 七、最佳实践

### 1. Prompt File 命名规范

```bash
✅ 好的命名：
- code-review.prompt           # 清晰、简洁
- generate-api-test.prompt     # 动词开头，表明动作
- explain-algorithm.prompt     # 表达用途

❌ 不好的命名：
- prompt1.prompt               # 无意义
- myPrompt.prompt              # 不规范
- CODE_REVIEW.prompt           # 大写
```

### 2. 编写清晰的描述

```yaml
# ✅ 好的描述
---
name: generate-unit-test
description: 为指定函数生成完整的单元测试，包含正常、边界和错误情况
---

# ❌ 不好的描述
---
name: generate-unit-test
description: 生成测试
---
```

### 3. 参数设计原则

```yaml
# ✅ 好的参数设计
---
params:
  - name: endpoint_path          # 清晰的名称
    description: 'API路径，如 /api/users/:id'  # 详细说明
    required: true               # 明确是否必需
---

# ❌ 不好的参数设计
---
params:
  - name: p1                     # 名称不清晰
  - name: p2                     # 缺少说明
---
```

## 八、常见问题与故障排除

### 问题 1：Prompt File 不生效

**解决方案：**

```markdown
✅ 检查清单：

1. 文件位置正确？
   ✓ 应该在 .github/prompts/ 目录下

2. 文件扩展名正确？
   ✓ 必须是 .prompt

3. Frontmatter 格式正确？
   ✓ 使用 YAML 格式
   ✓ name 字段存在且正确

4. VS Code 重启了吗？
   ✓ 新增 prompt 文件后需要重启
```

### 问题 2：参数没有被替换

**解决方案：**

```yaml
# ❌ 错误写法
---
params:
  - param1  # 缺少 name 字段
---

# ✅ 正确写法
---
params:
  - name: param1  # 正确定义
---

使用 {{param1}}  # 正确的语法
```

## 九、总结

### Prompt Files 的价值

- 📝 **标准化**：将最佳实践固化为可重用模板
- ⚡ **提效**：减少重复输入，一键调用复杂指令
- 🤝 **协作**：团队共享知识和工作流程
- 🔄 **一致性**：确保输出质量稳定可预测
- 📚 **知识沉淀**：将个人经验转化为团队资产

### 核心理念

> **Prompt Files 就像团队的"快捷命令库"**：将复杂的、重复的 AI 交互封装成简单的命令，让团队成员可以快速、一致地完成常见任务。

### 快速开始步骤

1. **创建目录**：在项目根目录创建 `.github/prompts/`
2. **创建第一个 prompt**：从简单的代码审查或测试生成开始
3. **测试验证**：使用 `/prompt-name` 调用并验证效果
4. **收集反馈**：让团队成员试用并提供反馈
5. **迭代优化**：根据实际使用情况改进 prompt
6. **建立库**：逐步积累团队的 prompt 库

---

**文档版本：** 1.0  
**创建日期：** 2026-01-19  
**最后更新：** 2026-01-19  
**适用版本：** GitHub Copilot with Claude Sonnet 4.5  
**参考文档：** instruction_guide.md, agent_guide.md  
**作者备注：** 专注于 `.prompt` 文件功能，与 instruction 和 agent 形成完整的 Copilot 定制化体系
