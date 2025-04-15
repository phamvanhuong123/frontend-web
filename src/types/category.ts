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

export default Category;