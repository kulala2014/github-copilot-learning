# Custom Agents vs Prompt Files 对比指南

## 文档概述

本文档详细对比 GitHub Copilot 的两个核心功能：Custom Agents（自定义智能体）和 Prompt Files（提示词文件），帮助你理解何时使用哪个功能。

---

## 一、核心概念对比

### Custom Agents（自定义智能体）

**定义：** 具有特定角色、职责和工具集的专业 AI 助手

```
特点：
🤖 有明确的角色定位（如文档专家、安全审查员）
🔧 可限制访问的工具（read、edit、search 等）
💬 支持多轮对话，保持上下文
👥 适合需要深度交互的复杂任务
```

**文件结构：**
```yaml
# .github/agents/readme-specialist.agent.md
---
name: readme-specialist
description: 文档编写专家
tools: ['read', 'edit', 'search']
---
你是一个 README 文档编写专家...
```

**调用方式：**
```
@readme-specialist 帮我优化这个 README 文件
```

---

### Prompt Files（提示词文件）

**定义：** 可重用、参数化的任务模板，用于标准化的一次性操作

```
特点：
📝 参数化模板（支持 {{变量}}）
⚡ 一键执行，立即输出
📋 结构化、一致的结果
🔄 可重复使用，输入不同
```

**文件结构：**
```yaml
# .github/prompts/explain-code.prompt
---
name: explain-code
description: 代码解释工具
params:
  - name: audience_level
    default: 'intermediate'
---
为选中的代码提供清晰解释...
```

**调用方式：**
```
/explain-code beginner
/explain-code advanced
```

---

## 二、详细对比表

| 对比维度 | Custom Agents 🤖 | Prompt Files 📝 |
|---------|------------------|----------------|
| **文件位置** | `.github/agents/` | `.github/prompts/` |
| **文件扩展名** | `.agent.md` | `.prompt` |
| **调用方式** | `@agent-name` | `/prompt-name` |
| **参数支持** | ❌ 不直接支持参数 | ✅ 支持参数化 `{{param}}` |
| **交互模式** | 💬 多轮对话 | ⚡ 一次性执行 |
| **上下文保持** | ✅ 保持对话上下文 | ❌ 独立执行 |
| **工具限制** | ✅ 可限制工具集 | ❌ 无工具限制概念 |
| **输出格式** | 🔄 灵活，随对话变化 | 📋 固定结构化输出 |
| **适用场景** | 复杂、探索性任务 | 重复性、标准化任务 |
| **学习成本** | 中等（需理解角色定位） | 低（简单的模板调用） |

---

## 三、使用场景详解

### 何时使用 Custom Agents？

#### ✅ 适合的场景

1. **需要专业领域知识**
   ```
   场景：安全审查
   使用：@security-expert 审查这段代码的安全问题
   为什么：需要持续对话，深入分析多个安全层面
   ```

2. **需要多轮交互**
   ```
   场景：架构设计
   使用：@architect 帮我设计用户认证系统
   对话：
   - 首先讨论需求
   - 然后设计架构
   - 最后优化方案
   ```

3. **需要限制工具访问**
   ```
   场景：只读文档助手
   使用：@doc-viewer 查找关于配置的说明
   原因：只给 read 和 search 权限，不允许修改代码
   ```

4. **探索性、开放式任务**
   ```
   场景：代码重构建议
   使用：@refactoring-expert 这个模块该如何重构？
   过程：通过多轮对话逐步明确重构方案
   ```

#### ❌ 不适合的场景

- 需要每次输出格式完全一致
- 简单的、一次性的任务
- 需要频繁切换参数的操作

---

### 何时使用 Prompt Files？

#### ✅ 适合的场景

1. **标准化的重复任务**
   ```
   场景：代码解释
   使用：/explain-code intermediate
   为什么：每次都需要相同的 6 个解释维度
   ```

2. **参数化的模板操作**
   ```
   场景：生成测试
   使用：
   - /generate-unit-test UserService
   - /generate-unit-test PaymentService
   每次只是被测类名不同，流程一样
   ```

3. **团队标准化输出**
   ```
   场景：代码审查
   使用：/code-review security
   原因：团队需要统一的审查标准和输出格式
   ```

4. **快速的一次性操作**
   ```
   场景：生成 API 文档
   使用：/api-doc [选中函数]
   结果：立即生成标准格式的文档
   ```

#### ❌ 不适合的场景

- 需要多轮讨论的复杂任务
- 需要根据上下文调整策略
- 探索性的、不确定的工作

---

## 四、实际案例对比

### 案例 1：代码解释

#### 使用 Custom Agent 的方式

```
你：@code-expert 这段代码是做什么的？

智能体：这是一个邮箱域名验证类。让我详细分析...

你：它有性能问题吗？

智能体：是的，我注意到每次验证都创建新的 Regex 对象...

你：如何优化？

智能体：建议使用 static readonly Regex，并添加 RegexOptions.Compiled...

你：给我完整的优化代码

智能体：[提供优化后的完整代码]
```

**特点：**
- ✅ 自然的对话流程
- ✅ 可以逐步深入
- ✅ 灵活应对追问
- ❌ 每次输出格式可能不同

---

#### 使用 Prompt File 的方式

```
你：[选中 EmailDomainSettings 类]
    /explain-code advanced

系统：立即输出包含以下结构的完整解释：
📋 Code Overview
🔍 Step-by-Step Breakdown  
💡 Key Concepts
🎯 Usage Examples
⚠️ Important Notes
🚀 Practical Applications
```

**特点：**
- ✅ 输出格式一致
- ✅ 执行速度快
- ✅ 适合生成文档
- ❌ 无法追问和深入

---

### 案例 2：生成测试代码

#### 使用 Custom Agent

```
你：@test-expert 帮我为 EmailDomainSettings 生成测试

智能体：好的，我看到这个类有验证逻辑。你想测试哪些方面？

你：全面的单元测试

智能体：明白了。我建议包括：
      1. 有效域名测试
      2. 无效域名测试
      3. 边界情况
      4. 异常处理
      你觉得还需要什么？

你：加上性能测试

智能体：[生成包含性能测试的完整测试套件]
```

**优势：** 可以通过对话调整测试范围和重点

---

#### 使用 Prompt File

```
你：[选中 EmailDomainSettings 类]
    /generate-unit-tests xUnit

系统：立即生成标准的测试代码，包含：
- 正常路径测试
- 边界条件测试
- 异常场景测试
- 使用 AAA 模式
- 清晰的测试命名
```

**优势：** 快速、标准化、可重复

---

## 五、协同使用策略

### 黄金组合：Agent + Prompt

很多时候，最佳实践是结合使用两者：

```markdown
## 工作流示例：开发新功能

### 阶段 1：设计（使用 Agent）
@architect 帮我设计一个用户注册功能，需要邮箱验证

[多轮对话，讨论需求、设计方案]

### 阶段 2：实现（使用 Agent）
@code-expert 根据设计实现 UserRegistration 类

### 阶段 3：测试（使用 Prompt）
/generate-unit-tests UserRegistration
/test-coverage 80

### 阶段 4：文档（使用 Prompt）
/explain-code intermediate [用于生成开发文档]
/api-doc [生成 API 文档]

### 阶段 5：审查（使用 Prompt）
/code-review security
/code-review performance

### 阶段 6：优化（使用 Agent）
@refactoring-expert 根据审查结果优化代码

[多轮对话，讨论优化方案]
```

---

## 六、选择决策树

```
开始
  │
  ├─ 是否需要多轮对话？
  │   ├─ 是 → 使用 Custom Agent
  │   └─ 否 ↓
  │
  ├─ 是否需要一致的输出格式？
  │   ├─ 是 → 使用 Prompt File
  │   └─ 否 ↓
  │
  ├─ 是否需要参数化？
  │   ├─ 是 → 使用 Prompt File
  │   └─ 否 ↓
  │
  ├─ 是否是探索性任务？
  │   ├─ 是 → 使用 Custom Agent
  │   └─ 否 ↓
  │
  └─ 是否需要限制工具访问？
      ├─ 是 → 使用 Custom Agent
      └─ 否 → 两者皆可，按偏好选择
```

---

## 七、快速参考卡

### Custom Agent 快速参考

| 项目 | 内容 |
|------|------|
| **创建位置** | `.github/agents/name.agent.md` |
| **必需字段** | `name`, `description`, `instructions` |
| **可选字段** | `tools` (限制工具集) |
| **调用格式** | `@agent-name 你的问题` |
| **最佳实践** | 明确角色、限定职责、提供示例 |

### Prompt File 快速参考

| 项目 | 内容 |
|------|------|
| **创建位置** | `.github/prompts/name.prompt` |
| **必需字段** | `name`, `description` |
| **可选字段** | `params` (参数定义) |
| **调用格式** | `/prompt-name param1 param2` |
| **最佳实践** | 结构化输出、清晰参数、详细说明 |

---

## 八、常见误区

### ❌ 误区 1：认为只需要其中一个

**错误想法：** "有了 Custom Agents，就不需要 Prompt Files 了"

**正确理解：** 两者互补，服务不同场景
- Agent：深度交互、专业咨询
- Prompt：快速标准化操作

---

### ❌ 误区 2：过度使用 Custom Agents

**错误做法：**
```
创建了 @code-explainer agent
创建了 @test-generator agent  
创建了 @doc-writer agent
```

**更好的做法：**
```
创建一个 @senior-developer agent（涵盖多个能力）
+ 多个 Prompt Files（标准化输出）
  - /explain-code
  - /generate-tests
  - /api-doc
```

---

### ❌ 误区 3：Prompt File 过于复杂

**错误做法：**
```yaml
# 一个 prompt 试图做太多事情
name: do-everything
params:
  - task_type  # code/test/doc
  - language
  - framework
  - style
  # ... 10+ 参数
```

**更好的做法：**
```yaml
# 创建多个专注的 prompts
- explain-code.prompt
- generate-test.prompt
- create-doc.prompt
```

---

## 九、团队使用建议

### 小团队（2-5人）

**推荐配置：**
```
Custom Agents (2-3个)：
- @senior-developer - 通用开发助手
- @reviewer - 代码审查专家

Prompt Files (5-8个)：
- /explain-code
- /generate-tests
- /code-review
- /api-doc
- /refactor
```

---

### 中型团队（5-20人）

**推荐配置：**
```
Custom Agents (4-6个)：
- @architect - 架构设计
- @security-expert - 安全审查
- @performance-expert - 性能优化
- @doc-specialist - 文档专家

Prompt Files (10-15个)：
- 代码生成类（3-4个）
- 测试类（2-3个）
- 文档类（2-3个）
- 审查类（2-3个）
- 工具类（2-3个）
```

---

### 大型团队（20+人）

**推荐配置：**
```
Custom Agents (8-10个)：
- 按领域分：前端、后端、移动端、DevOps
- 按职能分：架构、安全、测试、文档

Prompt Files (20-30个)：
- 按技术栈分类
- 按项目阶段分类
- 建立 prompt 库索引
```

---

## 十、学习路径建议

### 第1周：理解概念
- 阅读 `instruction_guide.md`
- 阅读 `agent_guide.md`
- 阅读 `prompt_guide.md`
- 阅读本对比文档

### 第2周：实践 Prompt Files
- 创建第一个 prompt：`/explain-code`
- 实践参数化：添加 `audience_level` 参数
- 创建更多 prompts：测试生成、文档生成

### 第3周：实践 Custom Agents
- 创建第一个 agent：`@code-helper`
- 体验多轮对话
- 限制工具集

### 第4周：组合使用
- 设计工作流：Agent + Prompt 组合
- 优化现有配置
- 分享团队最佳实践

---

## 十一、总结

### 核心原则

```
记住这个公式：

Custom Agents  = 对话 + 专家 + 探索
Prompt Files   = 模板 + 标准 + 效率

何时用 Agent？ → 不确定、需讨论、复杂任务
何时用 Prompt？→ 确定、需标准、重复任务
```

### 最后的建议

1. **从 Prompt Files 开始** - 更容易上手，立即见效
2. **逐步添加 Agents** - 根据团队需求创建专家助手
3. **持续优化** - 收集反馈，改进配置
4. **团队共享** - 将最佳实践固化为文件

---

**文档版本：** 1.0  
**创建日期：** 2026-01-19  
**作者：** GitHub Copilot  
**相关文档：**
- [instruction_guide.md](instruction_guide.md)
- [agent_guide.md](agent_guide.md)
- [prompt_guide.md](prompt_guide.md)
