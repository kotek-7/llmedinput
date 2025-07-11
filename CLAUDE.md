# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project intended to develop a React library for LLM-powered input components with auto-completion functionality. The project is currently in its initial state with the standard Vite React template.

## Development Commands

### Core Commands

- `pnpm dev` - Start development server with HMR
- `pnpm build` - Build for production (runs TypeScript compilation then Vite build)
- `pnpm lint` - Run ESLint on all files
- `pnpm preview` - Preview production build locally
- `pnpm storybook` - Start Storybook development server
- `pnpm build-storybook` - Build Storybook for production

### Build Process

The build process uses a two-step approach:

1. TypeScript compilation via `tsc -b`
2. Vite bundling via `vite build`

## Project Structure

### Configuration Files

- **TypeScript**: Uses project references with `tsconfig.json` pointing to `tsconfig.app.json` and `tsconfig.node.json`
- **ESLint**: Modern flat config in `eslint.config.js` with React hooks and React refresh plugins
- **Vite**: Standard React plugin configuration

### Source Structure

- `src/` - Main application source
  - `main.tsx` - Application entry point with React 19 StrictMode
  - `App.tsx` - Main application component
  - `assets/` - Static assets
  - `components/` - React components

### Documentation Structure

- `docs/` - Project documentation
  - `project-specification.md` - Detailed library specifications and API design
  - `dropdown-prototype-plan.md` - Implementation plan for dropdown-style completion UI
  - `copilot-inline-prototype-plan.md` - Implementation plan for Copilot-style inline completion UI

## TypeScript Configuration

The project uses strict TypeScript settings with:

- Target: ES2022
- Module resolution: bundler mode
- Strict mode enabled
- No unused locals/parameters enforcement
- JSX: react-jsx (React 19 compatible)

## ESLint Configuration

Uses TypeScript ESLint with:

- Recommended JS and TypeScript rules
- React hooks recommended rules
- React refresh plugin for Vite
- Global ignores for `dist/` directory

## Library Development Notes

This project is intended to become a React library for LLM input components. When developing library components:

1. **Component Structure**: Plan for a provider pattern with `LLMInputProvider` and `LLMInput` components
2. **API Design**: Focus on compatibility with standard HTML input props
3. **LLM Integration**: Support multiple providers (OpenAI, Anthropic, etc.)
4. **Performance**: Implement debouncing, caching, and abort controllers for API calls
5. **Security**: Handle API keys securely and implement proper input validation

## Technology Stack

- React 19.1.0 with modern hooks
- TypeScript 5.8.3 with strict configuration
- Vite 7.0.4 for build tooling
- ESLint 9.30.1 with TypeScript integration
- pnpm as package manager

## Detailed Documentation

### Project Specifications

@.claude/docs/project-specification.md

### Prototype Implementation Plans

@.claude/docs/dropdown-prototype-plan.md

@.claude/docs/copilot-inline-prototype-plan.md

## Development Guidelines

- ユーザはすでに別のインスタンスでpnpm devでアプリをホストしているので、Claude codeはユーザにpnpm devの実行を提案しないでください