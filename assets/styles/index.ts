import '@unocss/reset/normalize.css'
import 'uno.css'
import { autoImport } from '@/utils'

export function setupStyles() {
  autoImport(
    import.meta.glob(
      ['./main.scss', './**/*', '!./modules/**/*', '!./theme/**/*'],
      {
        eager: true,
        // query: '?inline',
      }
    )
  )
}
