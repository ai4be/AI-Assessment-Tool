export interface Column {
  _id: string
  sequence?: number
}

export interface ColumnsSlice {
  columns: Column[]
  status: string
  doneFetching: boolean
}
