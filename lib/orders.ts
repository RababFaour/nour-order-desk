import { products } from "./catalogue";

export const STATUSES=["Pending","Preparing","Delivered"] as const;
export type Statuses=(typeof STATUSES)[number];// mtl kaen aam nshuf aaber l index
export type Order={
    id: string;
    customerName: string;
    phone: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    status: Statuses;
};

export type OrderInput=Partial<Omit<Order,"id"|"total">>;
///OrderInput means:any of the six fields(customerName,phone..) except id and total bcz they added by server
///so Omit<Order,"id"|"total"> means to remove them since client is not allowed to send them 

export function priceOf(productName:string){
    const product= products.find((p)=> p.name===productName);
    if(!product){
        throw new Error("Unknown product");
    }
    return product.price;
} 

export function Total(quantity:number, unitPrice:number){
    const cents= Math.round(unitPrice * 100);
    return(quantity*cents)/100;
}

/////////////Validation///////////
function checkText(value:unknown){
    if(typeof value !== "string" || value.trim()===""){
        return "Must be text";
    } 
}
function checkQuantity(value:unknown){
    if(typeof value!=="number" || !Number.isInteger(value)||value<1){
        return "Must be an integer > 0";
    }
}
function checkPrice(value:unknown){
    if(typeof value!=="number"|| !Number.isFinite(value)||value<0){
        return "Must be a <=0 ";
    }
    const cents=value*100;
    if(Math.abs(cents-Math.round(cents))>0.000001){
        return "Use at most 2 decimal places";
    }
}
function checkStatus(value:unknown){
    if(!STATUSES.includes(value as Statuses)){
        return "Must be Pending,Preparing,or Delivered.";
    }
}

///////isNew:true -> post
///////isNew:false -> patch
export function validateOrder(body:unknown,isNew:boolean){
    const errors:Record<string,string>={};
    const data:Record<string,unknown>={};
    if(typeof body!=="object" || body===null){
        return {errors:{body:"Send a JSON object"},data:{} as OrderInput}///////....................
    }
    const input = body as Record<string,unknown>;

    ///field name -> "checks"
    const checks:Record<string,(value:unknown)=> string |undefined> = {
        customerName: checkText,
        phone: checkText,
        productName:checkText,
        quantity: checkQuantity,
        unitPrice: checkPrice,
        status: checkStatus,
    };
    for(const field in checks){
        const value = input[field];
        if(value===undefined){
            if(isNew && field !=="status"){
                errors[field]="Required";
            }
            continue;
        }
        const message= checks[field](value);
        if(message){errors[field]=message;}
        else{data[field]=typeof value==="string"?value.trim():value;}
    }
    if(isNew && data.status===undefined){data.status="Pending";}
    if(!isNew && Object.keys(data).length===0 && Object.keys(errors).length===0){
        errors.body="Send at least one field to update";
        ///Object.keys(data).length  -> how many valid feilds are in data
        ///Object.keys(error).length -> how many errors are there
    }
    return {errors,data:data as OrderInput};
}


///////////////STORAGE////////////////
declare global{
    var orderStore:Order[]|undefined;
}

const orders:Order[]=(globalThis.orderStore ??=[// haida bekhalle l data alive hata law l server reloads
    {
        id:crypto.randomUUID(),// server behutu
        customerName:"Demo Customer",
        phone:"DEMO-001",
        productName:"Vanilla Candle",
        quantity:3,
        unitPrice:8,
        total:24,
        status:"Pending"
        },
]);

export function listOrders(){
    return[...orders].reverse();// newest first : hon copy l orders then reverse
}

export function getOrder(id:string){
    return orders.find((order)=>order.id===id);
}

export function createOrder(input:OrderInput){
    const order={
        ...input,/// l 3 pts henne copies the content : hon copy l inputs
        id:crypto.randomUUID(),
        total:Total(input.quantity!,priceOf(input.productName!)),
    } as Order;
    orders.push(order);
    return order;
}
export function updateOrder(id:string,changes:OrderInput){
    const order=getOrder(id);
    if(!order)return undefined;
    Object.assign(order,changes);
    order.total=Total(order.quantity,order.unitPrice);
    return order;
}
export function deleteOrder(id:string){
    const index = orders.findIndex((order)=>order.id===id);
    if(index===-1)return false;/// msh mwjud

    orders.splice(index,1);// benaes 1 mn i indexes
    return true;
}