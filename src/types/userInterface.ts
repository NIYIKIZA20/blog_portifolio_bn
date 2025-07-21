
// export enum Gender {
//     Male= "male",
//     Female= "female",
//     Other= "other"
// }

export interface UserInterface {
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    role: "admin" | "user";
    gender: "male" | "female" | "other";
    createdAt: NativeDate;
    updatedAt: NativeDate;
}

export interface AddUserInterface extends Omit<UserInterface, 'createdAt' | 'updatedAt'> {}
