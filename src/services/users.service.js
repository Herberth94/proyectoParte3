import { UserModel } from "../DAO/models/users.model";

class userDatas {
    async usersInformation(id){
        const viewCart = await UserModel.findOne({_id:id}).populate('cart');

    } 
}

export const userData = new userDatas()