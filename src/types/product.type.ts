export interface ProductType {
  id: number
  codeId: string
  price: number
  prePrice: number
  imageList: Image[]
  categoryId: number
  title: string
  des: string
  rate: number
  releaseDate: string
  sizeList: Size[]
  sold: number
}

interface Size {
  size: string
  quantity: number
}

interface Image {
  fileName: string
}

export interface ProductList {
  productList: ProductType[]
  totalPage: number
}

export interface ProductListConfig {
  page_num?: number | string
  page_size?: number | string
  sort_field?: string
  sort_dir?: string
  title?: string
  category_id?: number
}
