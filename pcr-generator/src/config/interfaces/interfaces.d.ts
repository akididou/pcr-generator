

interface ILaboratory {
    id: number;
    name: string;
    address: {
        street: string;
        city: string;
        zip: string;
        department: {
            name: string;
            code: string;
        }
    },
    phone: string;
    email: string;
}