'use client';
import { allCategories, Product } from "@/types/product";
import { useActionState } from "react";


//useActionState hooku ile birlikte gelir. formun il. açıldığında boş görünmesini hatrasız başlamasını sağlar
const initialState: NewProductFormState = {
    success:false,
    inputs:{},
    errors:{},
}


export interface NewProductFormState{
    success:boolean;
    message?:string;
    inputs?:Partial<Product>;
    errors?:{
        [K in keyof Product]?: string[];
    }
}

export default function NewProduct(){
    const [state, formAction, isPending] = useActionState<NewProductFormState, FormData>(addNewProductAction, initialState);

    if(isPending) return <div>Loading...</div>

    console.log('state',state);

    return(
           <main className='max-w-xl mx-auto'>
      <h1 className='my-12'>Add a New Product</h1>
      <form action={formAction}>
        <div className='flex flex-col'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            id='title'
            name='title'
            className='dark:bg-stone-200 dark:text-stone-900'
            defaultValue={state?.inputs?.title ?? ''}
          />
          {state?.errors?.title ? <p>{state?.errors?.title}</p> : <></>}
        </div>
        <div className='flex flex-col'>
          <label htmlFor='description'>Description</label>
          <input type='text' id='description' name='description' className='dark:bg-stone-200 dark:text-stone-900'/>
        </div>

        <div className='flex flex-col'>
          <label htmlFor='category'>Category</label>
          <select id='category' className='dark:bg-stone-200 dark:text-stone-900'>
            <option value=''>select category</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className='my-8'>Create Product</button>
      </form>
    </main>
    );

};