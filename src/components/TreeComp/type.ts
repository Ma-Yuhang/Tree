export interface Tree {
  id: string
  label: string
  checked: boolean
  children?: TreeData
}

export type TreeData = Tree[]

export interface TreeCompProps {
  /**
   * 树形数据
   */
  data: TreeData
  /**
   * 是否显示复选框
   */
  showCheckbox?: boolean
  /**
   * 唯一标识
   */
  uniqueKey?: keyof chooseStringAndNumber<Tree>
}

type chooseStringAndNumber<T extends Record<string, any>> = {
  [K in keyof T as T[K] extends string | number ? K : never]: T[K]
}
