import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [{ input: './src/', format: 'cjs', ext: 'cjs' }, { input: './src/' }],
  clean: true,
  declaration: true,
})
