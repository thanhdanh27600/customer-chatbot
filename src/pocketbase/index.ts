const PocketBase = require("pocketbase/cjs");
import Client from "pocketbase";
import {config} from "../utils/config";

const pb: Client = new PocketBase(config.pocketBaseUrl);
pb.autoCancellation(false);
pb.authStore.save(config.pocketBaseAdminToken);

// pb.collection("_superusers")
// 	.authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD)
// 	.then((admin) => {
// 		console.info("[Pocketbase] authed", admin);
// 	})
// 	.catch((error) => {
// 		console.error("[Pocketbase] Cannot auth", error);
// 	});

console.log("POCKETBASE:", config.pocketBaseUrl);
pb.health.check().then((res) => console.log(res));

export const pbDate = (date: string | Date) => {
	return new Date(date).toISOString().replace("T", " ");
};

export {pb};
