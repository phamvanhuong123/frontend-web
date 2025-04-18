//  interface User  {
//     id: string,
//     name: string,
//     description: string,
//     price: number,
//     isActive: boolean,
//     categoryName: string,
//     manufacturerName: string,
//     discountName: Number
// }
interface User  {
    email: string;
    id: string;
    isActive: boolean;
    name: string;
    role: string;
    phoneNumber: string;  
}

export interface CreateAUser {
    email: string;
    name: string;
    password: string;
    phoneNumber: string;
    role: string;
}

export default User