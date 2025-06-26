'use server';

import { z } from 'zod';
import { Category, AvailabilityStatus, ReturnPolicy, Tag, Product } from '@/types/product';
import { NewProductFormState } from '@/app/admin/products/new/page';

// 1. Tam Zod schema
const productSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(50).max(500),
  category: z.nativeEnum(Category),
  availabilityStatus: z.nativeEnum(AvailabilityStatus),
  returnPolicy: z.nativeEnum(ReturnPolicy),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  tags: z.array(z.nativeEnum(Tag)).min(1),
  dimensions: z.object({
    width: z.coerce.number().min(0),
    height: z.coerce.number().min(0),
    depth: z.coerce.number().min(0),
  }),
});

// 2. Form verisini ayıklama
function parseFormData(formData: FormData) {
  return {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    availabilityStatus: formData.get('availabilityStatus'),
    returnPolicy: formData.get('returnPolicy'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    tags: formData.getAll('tags'),
    dimensions: {
      width: formData.get('dimensions.width'),
      height: formData.get('dimensions.height'),
      depth: formData.get('dimensions.depth'),
    },
  };
}

// 3. Backend action
export async function addNewProductAction(
  _: NewProductFormState,
  formData: FormData
): Promise<NewProductFormState> {
  console.log('🛠️ Receiving new product submission...');

  const rawData = parseFormData(formData);
  const result = productSchema.safeParse(rawData);

  if (!result.success) {
    console.warn('❌ Validation failed:', result.error.format());
    return {
      success: false,
      message: 'Please correct the form input',
      inputs: rawData,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const validated = result.data;
  console.log('✅ Product is valid:', validated);

  // TODO: Firebase'e veya veritabanına kayıt işlemi buraya

  return {
    success: true,
    message: 'The product is created successfully',
  };
}
