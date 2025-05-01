import {pb} from "../pocketbase";

export const getOrg = async (id: string) => {
	return pb.collection("orgs").getOne(id);
};
