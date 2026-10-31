import {getOrder,validateOrder,updateOrder,deleteOrder} from "@/lib/orders";

type RouteContext = {
    params : Promise<{id:string;}
    >;
};


// GET
 export async function GET(
    request : Request,
    {params} :RouteContext
 ){
    const {id} = await params;      /// hon hattet parameters laen bade she m3ayan mn l server yaani mmkn ekhd she by searching aa title masalan
    const order = getOrder(id);

    if(!order){
        return Response.json(
            {error:"Order not found"},
            {status:404}
        );
    }
    return Response.json(order);
 }

//PATCH
export async function PATCH(
    request:Request,
    {params} : RouteContext
){
    const {id}=await params;
    const body=await request.json();
    const order=getOrder(id);
    if(!order){
        return Response.json({error:"Order not found"},{status:404});
    }
    const{errors,data}=validateOrder(body,false);
    if(Object.keys(errors).length>0){
        return Response.json({errors},{status:400});
    }
    const updated= updateOrder(id,data);
    return Response.json(updated);
}

//DELETE
export async function DELETE(
    request:Request,
    {params}:RouteContext
){
    const {id}= await params;
    const removed = deleteOrder(id);
    if(!removed){
        return Response.json({error:"Order not found"},{status:404});
    }
    return Response.json({message:"Order deleted"});
}