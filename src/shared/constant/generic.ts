import e from "express";

//generic
export const GENERIC_USING_STATUS = 1;
export const GENERIC_DELETED_STATUS = 2;
//user
export const USER_ACTIVE_STATUS = 1;
export const USER_DISABLED_STATUS = 2;
export const USER_DELETED_STATUS = 3;

//product
export const PRODUCT_ACTIVE_STATUS = 1;
export const PRODUCT_DISABLED_STATUS = 2;
export const PRODUCT_DELETED_STATUS = 3;


//order
export const SALE_ITEM_TYPE_MENU = 1;
export const SALE_ITEM_TYPE_CUSTOM = 2;

export const INTERNAL_SERVER_ERROR_MSG = 'Server error, please contact developer';
