export type CreateUserDto = {
    email: string;       
    firstName: string;   
    description: string; 
    sex: string;         
    passwordHash: string;
    age: number;         
    purpose: string[];   
    mainPhoto: string;   
    photos: string[];    
    location: string;    
  };