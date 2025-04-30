import {Request} from "express";
import {RecordModel} from "pocketbase";

export interface RequestWithGuest extends Request {
	guest: RecordModel;
}

export interface RequestWithOrg extends Request {
	org?: RecordModel;
}
