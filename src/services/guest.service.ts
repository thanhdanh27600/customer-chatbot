import {pb} from "../pocketbase";

export const getGuest = async (id: string) => {
	return pb.collection("guests").getOne(id);
};
export const createGuest = async (data: any) => {
	return pb.collection("guests").create(data);
};
