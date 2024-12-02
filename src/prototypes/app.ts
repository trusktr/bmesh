import useThreeWebGL2, { useDarkScene, useVisualDebug } from './_lib/useThreeWebGL2.js'

export const App = useDarkScene(useThreeWebGL2())

export const Debug = await useVisualDebug(App)
