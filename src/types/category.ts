interface Category {
  id: string;
  name: string;
  description: string;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  productCount: number;
  subCategoryCount: number;
  subCategories?: Category[];
}

export interface ParentCategory {
  id: string;
  name: string;
}

export default Category;