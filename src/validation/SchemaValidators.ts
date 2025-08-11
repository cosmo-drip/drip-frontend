import Ajv from "ajv";
import { addCustomFormats } from "../utils/AjvFormats";

export const ajv = addCustomFormats(
    new Ajv({ allErrors: true, strict: false })
);