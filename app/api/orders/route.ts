import {getOrder, createOrder, validateOrder, listOrders} from "@/lib/orders"

export async function GET(){
    return Response.json(listOrders());
}

export async function POST(request: Request){
    const body= await request.json();
    const{errors,data}= validateOrder(body,true);
    if(Object.keys(errors).length>0){               ///list of errors
        return Response.json({errors},{status:400});
    }
    const order=createOrder(data);
    return Response.json(order,{status:201});
}