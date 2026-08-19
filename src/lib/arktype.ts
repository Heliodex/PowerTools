import { configure } from "arktype/config"

configure({ onUndeclaredKey: "reject" })

export * from "arktype"
