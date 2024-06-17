export class ResponseData<D> {
   success: boolean;
   message: string;
   data: D | D[];
   statusCode: number;

   constructor(success: boolean, data: D | D[], message: string, statusCode: number) {
      this.success = success;
      this.message = message;
      this.data = data;
      this.statusCode = statusCode;

      return this;
   }
}
