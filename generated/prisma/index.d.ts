
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Habitacion
 * 
 */
export type Habitacion = $Result.DefaultSelection<Prisma.$HabitacionPayload>
/**
 * Model Cliente
 * 
 */
export type Cliente = $Result.DefaultSelection<Prisma.$ClientePayload>
/**
 * Model Tarifa
 * 
 */
export type Tarifa = $Result.DefaultSelection<Prisma.$TarifaPayload>
/**
 * Model Reserva
 * 
 */
export type Reserva = $Result.DefaultSelection<Prisma.$ReservaPayload>
/**
 * Model Pago
 * 
 */
export type Pago = $Result.DefaultSelection<Prisma.$PagoPayload>
/**
 * Model ImagenHabitacion
 * 
 */
export type ImagenHabitacion = $Result.DefaultSelection<Prisma.$ImagenHabitacionPayload>
/**
 * Model Conversation
 * 
 */
export type Conversation = $Result.DefaultSelection<Prisma.$ConversationPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const EstadoHabitacion: {
  DISPONIBLE: 'DISPONIBLE',
  MANTENIMIENTO: 'MANTENIMIENTO',
  INACTIVA: 'INACTIVA'
};

export type EstadoHabitacion = (typeof EstadoHabitacion)[keyof typeof EstadoHabitacion]


export const EstadoReserva: {
  PENDIENTE_PAGO: 'PENDIENTE_PAGO',
  CONFIRMADA: 'CONFIRMADA',
  CANCELADA: 'CANCELADA',
  EXPIRADA: 'EXPIRADA',
  CHECK_IN: 'CHECK_IN',
  CHECK_OUT: 'CHECK_OUT'
};

export type EstadoReserva = (typeof EstadoReserva)[keyof typeof EstadoReserva]


export const EstadoPago: {
  NO_GENERADO: 'NO_GENERADO',
  PENDIENTE: 'PENDIENTE',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
  VENCIDO: 'VENCIDO',
  REEMBOLSADO: 'REEMBOLSADO'
};

export type EstadoPago = (typeof EstadoPago)[keyof typeof EstadoPago]


export const ConversationMode: {
  BOT: 'BOT',
  HUMANO: 'HUMANO'
};

export type ConversationMode = (typeof ConversationMode)[keyof typeof ConversationMode]


export const BookingStep: {
  INICIO: 'INICIO',
  PIDIENDO_FECHAS: 'PIDIENDO_FECHAS',
  PIDIENDO_PERSONAS: 'PIDIENDO_PERSONAS',
  MOSTRANDO_DISPONIBILIDAD: 'MOSTRANDO_DISPONIBILIDAD',
  ESPERANDO_CONFIRMACION: 'ESPERANDO_CONFIRMACION',
  ESPERANDO_PAGO: 'ESPERANDO_PAGO',
  COMPLETADO: 'COMPLETADO'
};

export type BookingStep = (typeof BookingStep)[keyof typeof BookingStep]


export const MessageRole: {
  USER: 'USER',
  ASSISTANT: 'ASSISTANT',
  TOOL: 'TOOL'
};

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole]

}

export type EstadoHabitacion = $Enums.EstadoHabitacion

export const EstadoHabitacion: typeof $Enums.EstadoHabitacion

export type EstadoReserva = $Enums.EstadoReserva

export const EstadoReserva: typeof $Enums.EstadoReserva

export type EstadoPago = $Enums.EstadoPago

export const EstadoPago: typeof $Enums.EstadoPago

export type ConversationMode = $Enums.ConversationMode

export const ConversationMode: typeof $Enums.ConversationMode

export type BookingStep = $Enums.BookingStep

export const BookingStep: typeof $Enums.BookingStep

export type MessageRole = $Enums.MessageRole

export const MessageRole: typeof $Enums.MessageRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Habitacions
 * const habitacions = await prisma.habitacion.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Habitacions
   * const habitacions = await prisma.habitacion.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.habitacion`: Exposes CRUD operations for the **Habitacion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Habitacions
    * const habitacions = await prisma.habitacion.findMany()
    * ```
    */
  get habitacion(): Prisma.HabitacionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cliente`: Exposes CRUD operations for the **Cliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clientes
    * const clientes = await prisma.cliente.findMany()
    * ```
    */
  get cliente(): Prisma.ClienteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tarifa`: Exposes CRUD operations for the **Tarifa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tarifas
    * const tarifas = await prisma.tarifa.findMany()
    * ```
    */
  get tarifa(): Prisma.TarifaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reserva`: Exposes CRUD operations for the **Reserva** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reservas
    * const reservas = await prisma.reserva.findMany()
    * ```
    */
  get reserva(): Prisma.ReservaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pago`: Exposes CRUD operations for the **Pago** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pagos
    * const pagos = await prisma.pago.findMany()
    * ```
    */
  get pago(): Prisma.PagoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.imagenHabitacion`: Exposes CRUD operations for the **ImagenHabitacion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImagenHabitacions
    * const imagenHabitacions = await prisma.imagenHabitacion.findMany()
    * ```
    */
  get imagenHabitacion(): Prisma.ImagenHabitacionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.conversation`: Exposes CRUD operations for the **Conversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conversations
    * const conversations = await prisma.conversation.findMany()
    * ```
    */
  get conversation(): Prisma.ConversationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Habitacion: 'Habitacion',
    Cliente: 'Cliente',
    Tarifa: 'Tarifa',
    Reserva: 'Reserva',
    Pago: 'Pago',
    ImagenHabitacion: 'ImagenHabitacion',
    Conversation: 'Conversation',
    Message: 'Message'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "habitacion" | "cliente" | "tarifa" | "reserva" | "pago" | "imagenHabitacion" | "conversation" | "message"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Habitacion: {
        payload: Prisma.$HabitacionPayload<ExtArgs>
        fields: Prisma.HabitacionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HabitacionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HabitacionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload>
          }
          findFirst: {
            args: Prisma.HabitacionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HabitacionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload>
          }
          findMany: {
            args: Prisma.HabitacionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload>[]
          }
          create: {
            args: Prisma.HabitacionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload>
          }
          createMany: {
            args: Prisma.HabitacionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HabitacionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload>[]
          }
          delete: {
            args: Prisma.HabitacionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload>
          }
          update: {
            args: Prisma.HabitacionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload>
          }
          deleteMany: {
            args: Prisma.HabitacionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HabitacionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HabitacionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload>[]
          }
          upsert: {
            args: Prisma.HabitacionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HabitacionPayload>
          }
          aggregate: {
            args: Prisma.HabitacionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHabitacion>
          }
          groupBy: {
            args: Prisma.HabitacionGroupByArgs<ExtArgs>
            result: $Utils.Optional<HabitacionGroupByOutputType>[]
          }
          count: {
            args: Prisma.HabitacionCountArgs<ExtArgs>
            result: $Utils.Optional<HabitacionCountAggregateOutputType> | number
          }
        }
      }
      Cliente: {
        payload: Prisma.$ClientePayload<ExtArgs>
        fields: Prisma.ClienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          findFirst: {
            args: Prisma.ClienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          findMany: {
            args: Prisma.ClienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          create: {
            args: Prisma.ClienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          createMany: {
            args: Prisma.ClienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          delete: {
            args: Prisma.ClienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          update: {
            args: Prisma.ClienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          deleteMany: {
            args: Prisma.ClienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClienteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          upsert: {
            args: Prisma.ClienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          aggregate: {
            args: Prisma.ClienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCliente>
          }
          groupBy: {
            args: Prisma.ClienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClienteCountArgs<ExtArgs>
            result: $Utils.Optional<ClienteCountAggregateOutputType> | number
          }
        }
      }
      Tarifa: {
        payload: Prisma.$TarifaPayload<ExtArgs>
        fields: Prisma.TarifaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TarifaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TarifaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload>
          }
          findFirst: {
            args: Prisma.TarifaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TarifaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload>
          }
          findMany: {
            args: Prisma.TarifaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload>[]
          }
          create: {
            args: Prisma.TarifaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload>
          }
          createMany: {
            args: Prisma.TarifaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TarifaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload>[]
          }
          delete: {
            args: Prisma.TarifaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload>
          }
          update: {
            args: Prisma.TarifaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload>
          }
          deleteMany: {
            args: Prisma.TarifaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TarifaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TarifaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload>[]
          }
          upsert: {
            args: Prisma.TarifaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TarifaPayload>
          }
          aggregate: {
            args: Prisma.TarifaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTarifa>
          }
          groupBy: {
            args: Prisma.TarifaGroupByArgs<ExtArgs>
            result: $Utils.Optional<TarifaGroupByOutputType>[]
          }
          count: {
            args: Prisma.TarifaCountArgs<ExtArgs>
            result: $Utils.Optional<TarifaCountAggregateOutputType> | number
          }
        }
      }
      Reserva: {
        payload: Prisma.$ReservaPayload<ExtArgs>
        fields: Prisma.ReservaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          findFirst: {
            args: Prisma.ReservaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          findMany: {
            args: Prisma.ReservaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>[]
          }
          create: {
            args: Prisma.ReservaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          createMany: {
            args: Prisma.ReservaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReservaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>[]
          }
          delete: {
            args: Prisma.ReservaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          update: {
            args: Prisma.ReservaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          deleteMany: {
            args: Prisma.ReservaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReservaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>[]
          }
          upsert: {
            args: Prisma.ReservaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          aggregate: {
            args: Prisma.ReservaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReserva>
          }
          groupBy: {
            args: Prisma.ReservaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservaCountArgs<ExtArgs>
            result: $Utils.Optional<ReservaCountAggregateOutputType> | number
          }
        }
      }
      Pago: {
        payload: Prisma.$PagoPayload<ExtArgs>
        fields: Prisma.PagoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PagoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PagoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload>
          }
          findFirst: {
            args: Prisma.PagoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PagoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload>
          }
          findMany: {
            args: Prisma.PagoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload>[]
          }
          create: {
            args: Prisma.PagoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload>
          }
          createMany: {
            args: Prisma.PagoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PagoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload>[]
          }
          delete: {
            args: Prisma.PagoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload>
          }
          update: {
            args: Prisma.PagoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload>
          }
          deleteMany: {
            args: Prisma.PagoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PagoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PagoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload>[]
          }
          upsert: {
            args: Prisma.PagoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagoPayload>
          }
          aggregate: {
            args: Prisma.PagoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePago>
          }
          groupBy: {
            args: Prisma.PagoGroupByArgs<ExtArgs>
            result: $Utils.Optional<PagoGroupByOutputType>[]
          }
          count: {
            args: Prisma.PagoCountArgs<ExtArgs>
            result: $Utils.Optional<PagoCountAggregateOutputType> | number
          }
        }
      }
      ImagenHabitacion: {
        payload: Prisma.$ImagenHabitacionPayload<ExtArgs>
        fields: Prisma.ImagenHabitacionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImagenHabitacionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImagenHabitacionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload>
          }
          findFirst: {
            args: Prisma.ImagenHabitacionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImagenHabitacionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload>
          }
          findMany: {
            args: Prisma.ImagenHabitacionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload>[]
          }
          create: {
            args: Prisma.ImagenHabitacionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload>
          }
          createMany: {
            args: Prisma.ImagenHabitacionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImagenHabitacionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload>[]
          }
          delete: {
            args: Prisma.ImagenHabitacionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload>
          }
          update: {
            args: Prisma.ImagenHabitacionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload>
          }
          deleteMany: {
            args: Prisma.ImagenHabitacionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImagenHabitacionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImagenHabitacionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload>[]
          }
          upsert: {
            args: Prisma.ImagenHabitacionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagenHabitacionPayload>
          }
          aggregate: {
            args: Prisma.ImagenHabitacionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImagenHabitacion>
          }
          groupBy: {
            args: Prisma.ImagenHabitacionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImagenHabitacionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImagenHabitacionCountArgs<ExtArgs>
            result: $Utils.Optional<ImagenHabitacionCountAggregateOutputType> | number
          }
        }
      }
      Conversation: {
        payload: Prisma.$ConversationPayload<ExtArgs>
        fields: Prisma.ConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findFirst: {
            args: Prisma.ConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findMany: {
            args: Prisma.ConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          create: {
            args: Prisma.ConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          createMany: {
            args: Prisma.ConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          delete: {
            args: Prisma.ConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          update: {
            args: Prisma.ConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          deleteMany: {
            args: Prisma.ConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConversationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          upsert: {
            args: Prisma.ConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          aggregate: {
            args: Prisma.ConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversation>
          }
          groupBy: {
            args: Prisma.ConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    habitacion?: HabitacionOmit
    cliente?: ClienteOmit
    tarifa?: TarifaOmit
    reserva?: ReservaOmit
    pago?: PagoOmit
    imagenHabitacion?: ImagenHabitacionOmit
    conversation?: ConversationOmit
    message?: MessageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type HabitacionCountOutputType
   */

  export type HabitacionCountOutputType = {
    reservas: number
  }

  export type HabitacionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservas?: boolean | HabitacionCountOutputTypeCountReservasArgs
  }

  // Custom InputTypes
  /**
   * HabitacionCountOutputType without action
   */
  export type HabitacionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HabitacionCountOutputType
     */
    select?: HabitacionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * HabitacionCountOutputType without action
   */
  export type HabitacionCountOutputTypeCountReservasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservaWhereInput
  }


  /**
   * Count Type ClienteCountOutputType
   */

  export type ClienteCountOutputType = {
    reservas: number
  }

  export type ClienteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservas?: boolean | ClienteCountOutputTypeCountReservasArgs
  }

  // Custom InputTypes
  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteCountOutputType
     */
    select?: ClienteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeCountReservasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservaWhereInput
  }


  /**
   * Count Type ConversationCountOutputType
   */

  export type ConversationCountOutputType = {
    messages: number
  }

  export type ConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationCountOutputType
     */
    select?: ConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Habitacion
   */

  export type AggregateHabitacion = {
    _count: HabitacionCountAggregateOutputType | null
    _avg: HabitacionAvgAggregateOutputType | null
    _sum: HabitacionSumAggregateOutputType | null
    _min: HabitacionMinAggregateOutputType | null
    _max: HabitacionMaxAggregateOutputType | null
  }

  export type HabitacionAvgAggregateOutputType = {
    capacidad: number | null
  }

  export type HabitacionSumAggregateOutputType = {
    capacidad: number | null
  }

  export type HabitacionMinAggregateOutputType = {
    id: string | null
    numero: string | null
    capacidad: number | null
    estado: $Enums.EstadoHabitacion | null
    activa: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HabitacionMaxAggregateOutputType = {
    id: string | null
    numero: string | null
    capacidad: number | null
    estado: $Enums.EstadoHabitacion | null
    activa: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HabitacionCountAggregateOutputType = {
    id: number
    numero: number
    capacidad: number
    estado: number
    activa: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type HabitacionAvgAggregateInputType = {
    capacidad?: true
  }

  export type HabitacionSumAggregateInputType = {
    capacidad?: true
  }

  export type HabitacionMinAggregateInputType = {
    id?: true
    numero?: true
    capacidad?: true
    estado?: true
    activa?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HabitacionMaxAggregateInputType = {
    id?: true
    numero?: true
    capacidad?: true
    estado?: true
    activa?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HabitacionCountAggregateInputType = {
    id?: true
    numero?: true
    capacidad?: true
    estado?: true
    activa?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type HabitacionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Habitacion to aggregate.
     */
    where?: HabitacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Habitacions to fetch.
     */
    orderBy?: HabitacionOrderByWithRelationInput | HabitacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HabitacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Habitacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Habitacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Habitacions
    **/
    _count?: true | HabitacionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HabitacionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HabitacionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HabitacionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HabitacionMaxAggregateInputType
  }

  export type GetHabitacionAggregateType<T extends HabitacionAggregateArgs> = {
        [P in keyof T & keyof AggregateHabitacion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHabitacion[P]>
      : GetScalarType<T[P], AggregateHabitacion[P]>
  }




  export type HabitacionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HabitacionWhereInput
    orderBy?: HabitacionOrderByWithAggregationInput | HabitacionOrderByWithAggregationInput[]
    by: HabitacionScalarFieldEnum[] | HabitacionScalarFieldEnum
    having?: HabitacionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HabitacionCountAggregateInputType | true
    _avg?: HabitacionAvgAggregateInputType
    _sum?: HabitacionSumAggregateInputType
    _min?: HabitacionMinAggregateInputType
    _max?: HabitacionMaxAggregateInputType
  }

  export type HabitacionGroupByOutputType = {
    id: string
    numero: string
    capacidad: number
    estado: $Enums.EstadoHabitacion
    activa: boolean
    createdAt: Date
    updatedAt: Date
    _count: HabitacionCountAggregateOutputType | null
    _avg: HabitacionAvgAggregateOutputType | null
    _sum: HabitacionSumAggregateOutputType | null
    _min: HabitacionMinAggregateOutputType | null
    _max: HabitacionMaxAggregateOutputType | null
  }

  type GetHabitacionGroupByPayload<T extends HabitacionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HabitacionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HabitacionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HabitacionGroupByOutputType[P]>
            : GetScalarType<T[P], HabitacionGroupByOutputType[P]>
        }
      >
    >


  export type HabitacionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    numero?: boolean
    capacidad?: boolean
    estado?: boolean
    activa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reservas?: boolean | Habitacion$reservasArgs<ExtArgs>
    _count?: boolean | HabitacionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["habitacion"]>

  export type HabitacionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    numero?: boolean
    capacidad?: boolean
    estado?: boolean
    activa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["habitacion"]>

  export type HabitacionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    numero?: boolean
    capacidad?: boolean
    estado?: boolean
    activa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["habitacion"]>

  export type HabitacionSelectScalar = {
    id?: boolean
    numero?: boolean
    capacidad?: boolean
    estado?: boolean
    activa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type HabitacionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "numero" | "capacidad" | "estado" | "activa" | "createdAt" | "updatedAt", ExtArgs["result"]["habitacion"]>
  export type HabitacionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservas?: boolean | Habitacion$reservasArgs<ExtArgs>
    _count?: boolean | HabitacionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type HabitacionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type HabitacionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $HabitacionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Habitacion"
    objects: {
      reservas: Prisma.$ReservaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      numero: string
      capacidad: number
      estado: $Enums.EstadoHabitacion
      activa: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["habitacion"]>
    composites: {}
  }

  type HabitacionGetPayload<S extends boolean | null | undefined | HabitacionDefaultArgs> = $Result.GetResult<Prisma.$HabitacionPayload, S>

  type HabitacionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HabitacionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HabitacionCountAggregateInputType | true
    }

  export interface HabitacionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Habitacion'], meta: { name: 'Habitacion' } }
    /**
     * Find zero or one Habitacion that matches the filter.
     * @param {HabitacionFindUniqueArgs} args - Arguments to find a Habitacion
     * @example
     * // Get one Habitacion
     * const habitacion = await prisma.habitacion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HabitacionFindUniqueArgs>(args: SelectSubset<T, HabitacionFindUniqueArgs<ExtArgs>>): Prisma__HabitacionClient<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Habitacion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HabitacionFindUniqueOrThrowArgs} args - Arguments to find a Habitacion
     * @example
     * // Get one Habitacion
     * const habitacion = await prisma.habitacion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HabitacionFindUniqueOrThrowArgs>(args: SelectSubset<T, HabitacionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HabitacionClient<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Habitacion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HabitacionFindFirstArgs} args - Arguments to find a Habitacion
     * @example
     * // Get one Habitacion
     * const habitacion = await prisma.habitacion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HabitacionFindFirstArgs>(args?: SelectSubset<T, HabitacionFindFirstArgs<ExtArgs>>): Prisma__HabitacionClient<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Habitacion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HabitacionFindFirstOrThrowArgs} args - Arguments to find a Habitacion
     * @example
     * // Get one Habitacion
     * const habitacion = await prisma.habitacion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HabitacionFindFirstOrThrowArgs>(args?: SelectSubset<T, HabitacionFindFirstOrThrowArgs<ExtArgs>>): Prisma__HabitacionClient<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Habitacions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HabitacionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Habitacions
     * const habitacions = await prisma.habitacion.findMany()
     * 
     * // Get first 10 Habitacions
     * const habitacions = await prisma.habitacion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const habitacionWithIdOnly = await prisma.habitacion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HabitacionFindManyArgs>(args?: SelectSubset<T, HabitacionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Habitacion.
     * @param {HabitacionCreateArgs} args - Arguments to create a Habitacion.
     * @example
     * // Create one Habitacion
     * const Habitacion = await prisma.habitacion.create({
     *   data: {
     *     // ... data to create a Habitacion
     *   }
     * })
     * 
     */
    create<T extends HabitacionCreateArgs>(args: SelectSubset<T, HabitacionCreateArgs<ExtArgs>>): Prisma__HabitacionClient<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Habitacions.
     * @param {HabitacionCreateManyArgs} args - Arguments to create many Habitacions.
     * @example
     * // Create many Habitacions
     * const habitacion = await prisma.habitacion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HabitacionCreateManyArgs>(args?: SelectSubset<T, HabitacionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Habitacions and returns the data saved in the database.
     * @param {HabitacionCreateManyAndReturnArgs} args - Arguments to create many Habitacions.
     * @example
     * // Create many Habitacions
     * const habitacion = await prisma.habitacion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Habitacions and only return the `id`
     * const habitacionWithIdOnly = await prisma.habitacion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HabitacionCreateManyAndReturnArgs>(args?: SelectSubset<T, HabitacionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Habitacion.
     * @param {HabitacionDeleteArgs} args - Arguments to delete one Habitacion.
     * @example
     * // Delete one Habitacion
     * const Habitacion = await prisma.habitacion.delete({
     *   where: {
     *     // ... filter to delete one Habitacion
     *   }
     * })
     * 
     */
    delete<T extends HabitacionDeleteArgs>(args: SelectSubset<T, HabitacionDeleteArgs<ExtArgs>>): Prisma__HabitacionClient<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Habitacion.
     * @param {HabitacionUpdateArgs} args - Arguments to update one Habitacion.
     * @example
     * // Update one Habitacion
     * const habitacion = await prisma.habitacion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HabitacionUpdateArgs>(args: SelectSubset<T, HabitacionUpdateArgs<ExtArgs>>): Prisma__HabitacionClient<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Habitacions.
     * @param {HabitacionDeleteManyArgs} args - Arguments to filter Habitacions to delete.
     * @example
     * // Delete a few Habitacions
     * const { count } = await prisma.habitacion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HabitacionDeleteManyArgs>(args?: SelectSubset<T, HabitacionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Habitacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HabitacionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Habitacions
     * const habitacion = await prisma.habitacion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HabitacionUpdateManyArgs>(args: SelectSubset<T, HabitacionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Habitacions and returns the data updated in the database.
     * @param {HabitacionUpdateManyAndReturnArgs} args - Arguments to update many Habitacions.
     * @example
     * // Update many Habitacions
     * const habitacion = await prisma.habitacion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Habitacions and only return the `id`
     * const habitacionWithIdOnly = await prisma.habitacion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HabitacionUpdateManyAndReturnArgs>(args: SelectSubset<T, HabitacionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Habitacion.
     * @param {HabitacionUpsertArgs} args - Arguments to update or create a Habitacion.
     * @example
     * // Update or create a Habitacion
     * const habitacion = await prisma.habitacion.upsert({
     *   create: {
     *     // ... data to create a Habitacion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Habitacion we want to update
     *   }
     * })
     */
    upsert<T extends HabitacionUpsertArgs>(args: SelectSubset<T, HabitacionUpsertArgs<ExtArgs>>): Prisma__HabitacionClient<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Habitacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HabitacionCountArgs} args - Arguments to filter Habitacions to count.
     * @example
     * // Count the number of Habitacions
     * const count = await prisma.habitacion.count({
     *   where: {
     *     // ... the filter for the Habitacions we want to count
     *   }
     * })
    **/
    count<T extends HabitacionCountArgs>(
      args?: Subset<T, HabitacionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HabitacionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Habitacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HabitacionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HabitacionAggregateArgs>(args: Subset<T, HabitacionAggregateArgs>): Prisma.PrismaPromise<GetHabitacionAggregateType<T>>

    /**
     * Group by Habitacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HabitacionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HabitacionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HabitacionGroupByArgs['orderBy'] }
        : { orderBy?: HabitacionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HabitacionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHabitacionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Habitacion model
   */
  readonly fields: HabitacionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Habitacion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HabitacionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reservas<T extends Habitacion$reservasArgs<ExtArgs> = {}>(args?: Subset<T, Habitacion$reservasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Habitacion model
   */
  interface HabitacionFieldRefs {
    readonly id: FieldRef<"Habitacion", 'String'>
    readonly numero: FieldRef<"Habitacion", 'String'>
    readonly capacidad: FieldRef<"Habitacion", 'Int'>
    readonly estado: FieldRef<"Habitacion", 'EstadoHabitacion'>
    readonly activa: FieldRef<"Habitacion", 'Boolean'>
    readonly createdAt: FieldRef<"Habitacion", 'DateTime'>
    readonly updatedAt: FieldRef<"Habitacion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Habitacion findUnique
   */
  export type HabitacionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HabitacionInclude<ExtArgs> | null
    /**
     * Filter, which Habitacion to fetch.
     */
    where: HabitacionWhereUniqueInput
  }

  /**
   * Habitacion findUniqueOrThrow
   */
  export type HabitacionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HabitacionInclude<ExtArgs> | null
    /**
     * Filter, which Habitacion to fetch.
     */
    where: HabitacionWhereUniqueInput
  }

  /**
   * Habitacion findFirst
   */
  export type HabitacionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HabitacionInclude<ExtArgs> | null
    /**
     * Filter, which Habitacion to fetch.
     */
    where?: HabitacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Habitacions to fetch.
     */
    orderBy?: HabitacionOrderByWithRelationInput | HabitacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Habitacions.
     */
    cursor?: HabitacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Habitacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Habitacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Habitacions.
     */
    distinct?: HabitacionScalarFieldEnum | HabitacionScalarFieldEnum[]
  }

  /**
   * Habitacion findFirstOrThrow
   */
  export type HabitacionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HabitacionInclude<ExtArgs> | null
    /**
     * Filter, which Habitacion to fetch.
     */
    where?: HabitacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Habitacions to fetch.
     */
    orderBy?: HabitacionOrderByWithRelationInput | HabitacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Habitacions.
     */
    cursor?: HabitacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Habitacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Habitacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Habitacions.
     */
    distinct?: HabitacionScalarFieldEnum | HabitacionScalarFieldEnum[]
  }

  /**
   * Habitacion findMany
   */
  export type HabitacionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HabitacionInclude<ExtArgs> | null
    /**
     * Filter, which Habitacions to fetch.
     */
    where?: HabitacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Habitacions to fetch.
     */
    orderBy?: HabitacionOrderByWithRelationInput | HabitacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Habitacions.
     */
    cursor?: HabitacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Habitacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Habitacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Habitacions.
     */
    distinct?: HabitacionScalarFieldEnum | HabitacionScalarFieldEnum[]
  }

  /**
   * Habitacion create
   */
  export type HabitacionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HabitacionInclude<ExtArgs> | null
    /**
     * The data needed to create a Habitacion.
     */
    data: XOR<HabitacionCreateInput, HabitacionUncheckedCreateInput>
  }

  /**
   * Habitacion createMany
   */
  export type HabitacionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Habitacions.
     */
    data: HabitacionCreateManyInput | HabitacionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Habitacion createManyAndReturn
   */
  export type HabitacionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * The data used to create many Habitacions.
     */
    data: HabitacionCreateManyInput | HabitacionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Habitacion update
   */
  export type HabitacionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HabitacionInclude<ExtArgs> | null
    /**
     * The data needed to update a Habitacion.
     */
    data: XOR<HabitacionUpdateInput, HabitacionUncheckedUpdateInput>
    /**
     * Choose, which Habitacion to update.
     */
    where: HabitacionWhereUniqueInput
  }

  /**
   * Habitacion updateMany
   */
  export type HabitacionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Habitacions.
     */
    data: XOR<HabitacionUpdateManyMutationInput, HabitacionUncheckedUpdateManyInput>
    /**
     * Filter which Habitacions to update
     */
    where?: HabitacionWhereInput
    /**
     * Limit how many Habitacions to update.
     */
    limit?: number
  }

  /**
   * Habitacion updateManyAndReturn
   */
  export type HabitacionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * The data used to update Habitacions.
     */
    data: XOR<HabitacionUpdateManyMutationInput, HabitacionUncheckedUpdateManyInput>
    /**
     * Filter which Habitacions to update
     */
    where?: HabitacionWhereInput
    /**
     * Limit how many Habitacions to update.
     */
    limit?: number
  }

  /**
   * Habitacion upsert
   */
  export type HabitacionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HabitacionInclude<ExtArgs> | null
    /**
     * The filter to search for the Habitacion to update in case it exists.
     */
    where: HabitacionWhereUniqueInput
    /**
     * In case the Habitacion found by the `where` argument doesn't exist, create a new Habitacion with this data.
     */
    create: XOR<HabitacionCreateInput, HabitacionUncheckedCreateInput>
    /**
     * In case the Habitacion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HabitacionUpdateInput, HabitacionUncheckedUpdateInput>
  }

  /**
   * Habitacion delete
   */
  export type HabitacionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HabitacionInclude<ExtArgs> | null
    /**
     * Filter which Habitacion to delete.
     */
    where: HabitacionWhereUniqueInput
  }

  /**
   * Habitacion deleteMany
   */
  export type HabitacionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Habitacions to delete
     */
    where?: HabitacionWhereInput
    /**
     * Limit how many Habitacions to delete.
     */
    limit?: number
  }

  /**
   * Habitacion.reservas
   */
  export type Habitacion$reservasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    where?: ReservaWhereInput
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    cursor?: ReservaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservaScalarFieldEnum | ReservaScalarFieldEnum[]
  }

  /**
   * Habitacion without action
   */
  export type HabitacionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Habitacion
     */
    select?: HabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Habitacion
     */
    omit?: HabitacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HabitacionInclude<ExtArgs> | null
  }


  /**
   * Model Cliente
   */

  export type AggregateCliente = {
    _count: ClienteCountAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  export type ClienteMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    telefono: string | null
    correo: string | null
    documento: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClienteMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    telefono: string | null
    correo: string | null
    documento: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClienteCountAggregateOutputType = {
    id: number
    nombre: number
    telefono: number
    correo: number
    documento: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClienteMinAggregateInputType = {
    id?: true
    nombre?: true
    telefono?: true
    correo?: true
    documento?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClienteMaxAggregateInputType = {
    id?: true
    nombre?: true
    telefono?: true
    correo?: true
    documento?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClienteCountAggregateInputType = {
    id?: true
    nombre?: true
    telefono?: true
    correo?: true
    documento?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cliente to aggregate.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clientes
    **/
    _count?: true | ClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClienteMaxAggregateInputType
  }

  export type GetClienteAggregateType<T extends ClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCliente[P]>
      : GetScalarType<T[P], AggregateCliente[P]>
  }




  export type ClienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClienteWhereInput
    orderBy?: ClienteOrderByWithAggregationInput | ClienteOrderByWithAggregationInput[]
    by: ClienteScalarFieldEnum[] | ClienteScalarFieldEnum
    having?: ClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClienteCountAggregateInputType | true
    _min?: ClienteMinAggregateInputType
    _max?: ClienteMaxAggregateInputType
  }

  export type ClienteGroupByOutputType = {
    id: string
    nombre: string
    telefono: string
    correo: string | null
    documento: string | null
    createdAt: Date
    updatedAt: Date
    _count: ClienteCountAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  type GetClienteGroupByPayload<T extends ClienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClienteGroupByOutputType[P]>
            : GetScalarType<T[P], ClienteGroupByOutputType[P]>
        }
      >
    >


  export type ClienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    telefono?: boolean
    correo?: boolean
    documento?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reservas?: boolean | Cliente$reservasArgs<ExtArgs>
    _count?: boolean | ClienteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    telefono?: boolean
    correo?: boolean
    documento?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    telefono?: boolean
    correo?: boolean
    documento?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectScalar = {
    id?: boolean
    nombre?: boolean
    telefono?: boolean
    correo?: boolean
    documento?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClienteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "telefono" | "correo" | "documento" | "createdAt" | "updatedAt", ExtArgs["result"]["cliente"]>
  export type ClienteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservas?: boolean | Cliente$reservasArgs<ExtArgs>
    _count?: boolean | ClienteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClienteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ClienteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ClientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cliente"
    objects: {
      reservas: Prisma.$ReservaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      telefono: string
      correo: string | null
      documento: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cliente"]>
    composites: {}
  }

  type ClienteGetPayload<S extends boolean | null | undefined | ClienteDefaultArgs> = $Result.GetResult<Prisma.$ClientePayload, S>

  type ClienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClienteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClienteCountAggregateInputType | true
    }

  export interface ClienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cliente'], meta: { name: 'Cliente' } }
    /**
     * Find zero or one Cliente that matches the filter.
     * @param {ClienteFindUniqueArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClienteFindUniqueArgs>(args: SelectSubset<T, ClienteFindUniqueArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cliente that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClienteFindUniqueOrThrowArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClienteFindUniqueOrThrowArgs>(args: SelectSubset<T, ClienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClienteFindFirstArgs>(args?: SelectSubset<T, ClienteFindFirstArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstOrThrowArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClienteFindFirstOrThrowArgs>(args?: SelectSubset<T, ClienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clientes
     * const clientes = await prisma.cliente.findMany()
     * 
     * // Get first 10 Clientes
     * const clientes = await prisma.cliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clienteWithIdOnly = await prisma.cliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClienteFindManyArgs>(args?: SelectSubset<T, ClienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cliente.
     * @param {ClienteCreateArgs} args - Arguments to create a Cliente.
     * @example
     * // Create one Cliente
     * const Cliente = await prisma.cliente.create({
     *   data: {
     *     // ... data to create a Cliente
     *   }
     * })
     * 
     */
    create<T extends ClienteCreateArgs>(args: SelectSubset<T, ClienteCreateArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clientes.
     * @param {ClienteCreateManyArgs} args - Arguments to create many Clientes.
     * @example
     * // Create many Clientes
     * const cliente = await prisma.cliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClienteCreateManyArgs>(args?: SelectSubset<T, ClienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clientes and returns the data saved in the database.
     * @param {ClienteCreateManyAndReturnArgs} args - Arguments to create many Clientes.
     * @example
     * // Create many Clientes
     * const cliente = await prisma.cliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clientes and only return the `id`
     * const clienteWithIdOnly = await prisma.cliente.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClienteCreateManyAndReturnArgs>(args?: SelectSubset<T, ClienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Cliente.
     * @param {ClienteDeleteArgs} args - Arguments to delete one Cliente.
     * @example
     * // Delete one Cliente
     * const Cliente = await prisma.cliente.delete({
     *   where: {
     *     // ... filter to delete one Cliente
     *   }
     * })
     * 
     */
    delete<T extends ClienteDeleteArgs>(args: SelectSubset<T, ClienteDeleteArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cliente.
     * @param {ClienteUpdateArgs} args - Arguments to update one Cliente.
     * @example
     * // Update one Cliente
     * const cliente = await prisma.cliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClienteUpdateArgs>(args: SelectSubset<T, ClienteUpdateArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clientes.
     * @param {ClienteDeleteManyArgs} args - Arguments to filter Clientes to delete.
     * @example
     * // Delete a few Clientes
     * const { count } = await prisma.cliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClienteDeleteManyArgs>(args?: SelectSubset<T, ClienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clientes
     * const cliente = await prisma.cliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClienteUpdateManyArgs>(args: SelectSubset<T, ClienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clientes and returns the data updated in the database.
     * @param {ClienteUpdateManyAndReturnArgs} args - Arguments to update many Clientes.
     * @example
     * // Update many Clientes
     * const cliente = await prisma.cliente.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clientes and only return the `id`
     * const clienteWithIdOnly = await prisma.cliente.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClienteUpdateManyAndReturnArgs>(args: SelectSubset<T, ClienteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Cliente.
     * @param {ClienteUpsertArgs} args - Arguments to update or create a Cliente.
     * @example
     * // Update or create a Cliente
     * const cliente = await prisma.cliente.upsert({
     *   create: {
     *     // ... data to create a Cliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cliente we want to update
     *   }
     * })
     */
    upsert<T extends ClienteUpsertArgs>(args: SelectSubset<T, ClienteUpsertArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteCountArgs} args - Arguments to filter Clientes to count.
     * @example
     * // Count the number of Clientes
     * const count = await prisma.cliente.count({
     *   where: {
     *     // ... the filter for the Clientes we want to count
     *   }
     * })
    **/
    count<T extends ClienteCountArgs>(
      args?: Subset<T, ClienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClienteAggregateArgs>(args: Subset<T, ClienteAggregateArgs>): Prisma.PrismaPromise<GetClienteAggregateType<T>>

    /**
     * Group by Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClienteGroupByArgs['orderBy'] }
        : { orderBy?: ClienteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cliente model
   */
  readonly fields: ClienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reservas<T extends Cliente$reservasArgs<ExtArgs> = {}>(args?: Subset<T, Cliente$reservasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cliente model
   */
  interface ClienteFieldRefs {
    readonly id: FieldRef<"Cliente", 'String'>
    readonly nombre: FieldRef<"Cliente", 'String'>
    readonly telefono: FieldRef<"Cliente", 'String'>
    readonly correo: FieldRef<"Cliente", 'String'>
    readonly documento: FieldRef<"Cliente", 'String'>
    readonly createdAt: FieldRef<"Cliente", 'DateTime'>
    readonly updatedAt: FieldRef<"Cliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cliente findUnique
   */
  export type ClienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente findUniqueOrThrow
   */
  export type ClienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente findFirst
   */
  export type ClienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente findFirstOrThrow
   */
  export type ClienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente findMany
   */
  export type ClienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Clientes to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente create
   */
  export type ClienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The data needed to create a Cliente.
     */
    data: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
  }

  /**
   * Cliente createMany
   */
  export type ClienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clientes.
     */
    data: ClienteCreateManyInput | ClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cliente createManyAndReturn
   */
  export type ClienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * The data used to create many Clientes.
     */
    data: ClienteCreateManyInput | ClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cliente update
   */
  export type ClienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The data needed to update a Cliente.
     */
    data: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
    /**
     * Choose, which Cliente to update.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente updateMany
   */
  export type ClienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clientes.
     */
    data: XOR<ClienteUpdateManyMutationInput, ClienteUncheckedUpdateManyInput>
    /**
     * Filter which Clientes to update
     */
    where?: ClienteWhereInput
    /**
     * Limit how many Clientes to update.
     */
    limit?: number
  }

  /**
   * Cliente updateManyAndReturn
   */
  export type ClienteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * The data used to update Clientes.
     */
    data: XOR<ClienteUpdateManyMutationInput, ClienteUncheckedUpdateManyInput>
    /**
     * Filter which Clientes to update
     */
    where?: ClienteWhereInput
    /**
     * Limit how many Clientes to update.
     */
    limit?: number
  }

  /**
   * Cliente upsert
   */
  export type ClienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The filter to search for the Cliente to update in case it exists.
     */
    where: ClienteWhereUniqueInput
    /**
     * In case the Cliente found by the `where` argument doesn't exist, create a new Cliente with this data.
     */
    create: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
    /**
     * In case the Cliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
  }

  /**
   * Cliente delete
   */
  export type ClienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter which Cliente to delete.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente deleteMany
   */
  export type ClienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clientes to delete
     */
    where?: ClienteWhereInput
    /**
     * Limit how many Clientes to delete.
     */
    limit?: number
  }

  /**
   * Cliente.reservas
   */
  export type Cliente$reservasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    where?: ReservaWhereInput
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    cursor?: ReservaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservaScalarFieldEnum | ReservaScalarFieldEnum[]
  }

  /**
   * Cliente without action
   */
  export type ClienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
  }


  /**
   * Model Tarifa
   */

  export type AggregateTarifa = {
    _count: TarifaCountAggregateOutputType | null
    _avg: TarifaAvgAggregateOutputType | null
    _sum: TarifaSumAggregateOutputType | null
    _min: TarifaMinAggregateOutputType | null
    _max: TarifaMaxAggregateOutputType | null
  }

  export type TarifaAvgAggregateOutputType = {
    personas: number | null
    precio: Decimal | null
  }

  export type TarifaSumAggregateOutputType = {
    personas: number | null
    precio: Decimal | null
  }

  export type TarifaMinAggregateOutputType = {
    id: string | null
    personas: number | null
    precio: Decimal | null
    activa: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TarifaMaxAggregateOutputType = {
    id: string | null
    personas: number | null
    precio: Decimal | null
    activa: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TarifaCountAggregateOutputType = {
    id: number
    personas: number
    precio: number
    activa: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TarifaAvgAggregateInputType = {
    personas?: true
    precio?: true
  }

  export type TarifaSumAggregateInputType = {
    personas?: true
    precio?: true
  }

  export type TarifaMinAggregateInputType = {
    id?: true
    personas?: true
    precio?: true
    activa?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TarifaMaxAggregateInputType = {
    id?: true
    personas?: true
    precio?: true
    activa?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TarifaCountAggregateInputType = {
    id?: true
    personas?: true
    precio?: true
    activa?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TarifaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tarifa to aggregate.
     */
    where?: TarifaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tarifas to fetch.
     */
    orderBy?: TarifaOrderByWithRelationInput | TarifaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TarifaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tarifas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tarifas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tarifas
    **/
    _count?: true | TarifaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TarifaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TarifaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TarifaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TarifaMaxAggregateInputType
  }

  export type GetTarifaAggregateType<T extends TarifaAggregateArgs> = {
        [P in keyof T & keyof AggregateTarifa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTarifa[P]>
      : GetScalarType<T[P], AggregateTarifa[P]>
  }




  export type TarifaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TarifaWhereInput
    orderBy?: TarifaOrderByWithAggregationInput | TarifaOrderByWithAggregationInput[]
    by: TarifaScalarFieldEnum[] | TarifaScalarFieldEnum
    having?: TarifaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TarifaCountAggregateInputType | true
    _avg?: TarifaAvgAggregateInputType
    _sum?: TarifaSumAggregateInputType
    _min?: TarifaMinAggregateInputType
    _max?: TarifaMaxAggregateInputType
  }

  export type TarifaGroupByOutputType = {
    id: string
    personas: number
    precio: Decimal
    activa: boolean
    createdAt: Date
    updatedAt: Date
    _count: TarifaCountAggregateOutputType | null
    _avg: TarifaAvgAggregateOutputType | null
    _sum: TarifaSumAggregateOutputType | null
    _min: TarifaMinAggregateOutputType | null
    _max: TarifaMaxAggregateOutputType | null
  }

  type GetTarifaGroupByPayload<T extends TarifaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TarifaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TarifaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TarifaGroupByOutputType[P]>
            : GetScalarType<T[P], TarifaGroupByOutputType[P]>
        }
      >
    >


  export type TarifaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    personas?: boolean
    precio?: boolean
    activa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tarifa"]>

  export type TarifaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    personas?: boolean
    precio?: boolean
    activa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tarifa"]>

  export type TarifaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    personas?: boolean
    precio?: boolean
    activa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tarifa"]>

  export type TarifaSelectScalar = {
    id?: boolean
    personas?: boolean
    precio?: boolean
    activa?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TarifaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "personas" | "precio" | "activa" | "createdAt" | "updatedAt", ExtArgs["result"]["tarifa"]>

  export type $TarifaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tarifa"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      personas: number
      precio: Prisma.Decimal
      activa: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tarifa"]>
    composites: {}
  }

  type TarifaGetPayload<S extends boolean | null | undefined | TarifaDefaultArgs> = $Result.GetResult<Prisma.$TarifaPayload, S>

  type TarifaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TarifaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TarifaCountAggregateInputType | true
    }

  export interface TarifaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tarifa'], meta: { name: 'Tarifa' } }
    /**
     * Find zero or one Tarifa that matches the filter.
     * @param {TarifaFindUniqueArgs} args - Arguments to find a Tarifa
     * @example
     * // Get one Tarifa
     * const tarifa = await prisma.tarifa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TarifaFindUniqueArgs>(args: SelectSubset<T, TarifaFindUniqueArgs<ExtArgs>>): Prisma__TarifaClient<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tarifa that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TarifaFindUniqueOrThrowArgs} args - Arguments to find a Tarifa
     * @example
     * // Get one Tarifa
     * const tarifa = await prisma.tarifa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TarifaFindUniqueOrThrowArgs>(args: SelectSubset<T, TarifaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TarifaClient<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tarifa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TarifaFindFirstArgs} args - Arguments to find a Tarifa
     * @example
     * // Get one Tarifa
     * const tarifa = await prisma.tarifa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TarifaFindFirstArgs>(args?: SelectSubset<T, TarifaFindFirstArgs<ExtArgs>>): Prisma__TarifaClient<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tarifa that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TarifaFindFirstOrThrowArgs} args - Arguments to find a Tarifa
     * @example
     * // Get one Tarifa
     * const tarifa = await prisma.tarifa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TarifaFindFirstOrThrowArgs>(args?: SelectSubset<T, TarifaFindFirstOrThrowArgs<ExtArgs>>): Prisma__TarifaClient<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tarifas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TarifaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tarifas
     * const tarifas = await prisma.tarifa.findMany()
     * 
     * // Get first 10 Tarifas
     * const tarifas = await prisma.tarifa.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tarifaWithIdOnly = await prisma.tarifa.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TarifaFindManyArgs>(args?: SelectSubset<T, TarifaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tarifa.
     * @param {TarifaCreateArgs} args - Arguments to create a Tarifa.
     * @example
     * // Create one Tarifa
     * const Tarifa = await prisma.tarifa.create({
     *   data: {
     *     // ... data to create a Tarifa
     *   }
     * })
     * 
     */
    create<T extends TarifaCreateArgs>(args: SelectSubset<T, TarifaCreateArgs<ExtArgs>>): Prisma__TarifaClient<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tarifas.
     * @param {TarifaCreateManyArgs} args - Arguments to create many Tarifas.
     * @example
     * // Create many Tarifas
     * const tarifa = await prisma.tarifa.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TarifaCreateManyArgs>(args?: SelectSubset<T, TarifaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tarifas and returns the data saved in the database.
     * @param {TarifaCreateManyAndReturnArgs} args - Arguments to create many Tarifas.
     * @example
     * // Create many Tarifas
     * const tarifa = await prisma.tarifa.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tarifas and only return the `id`
     * const tarifaWithIdOnly = await prisma.tarifa.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TarifaCreateManyAndReturnArgs>(args?: SelectSubset<T, TarifaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tarifa.
     * @param {TarifaDeleteArgs} args - Arguments to delete one Tarifa.
     * @example
     * // Delete one Tarifa
     * const Tarifa = await prisma.tarifa.delete({
     *   where: {
     *     // ... filter to delete one Tarifa
     *   }
     * })
     * 
     */
    delete<T extends TarifaDeleteArgs>(args: SelectSubset<T, TarifaDeleteArgs<ExtArgs>>): Prisma__TarifaClient<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tarifa.
     * @param {TarifaUpdateArgs} args - Arguments to update one Tarifa.
     * @example
     * // Update one Tarifa
     * const tarifa = await prisma.tarifa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TarifaUpdateArgs>(args: SelectSubset<T, TarifaUpdateArgs<ExtArgs>>): Prisma__TarifaClient<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tarifas.
     * @param {TarifaDeleteManyArgs} args - Arguments to filter Tarifas to delete.
     * @example
     * // Delete a few Tarifas
     * const { count } = await prisma.tarifa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TarifaDeleteManyArgs>(args?: SelectSubset<T, TarifaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tarifas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TarifaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tarifas
     * const tarifa = await prisma.tarifa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TarifaUpdateManyArgs>(args: SelectSubset<T, TarifaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tarifas and returns the data updated in the database.
     * @param {TarifaUpdateManyAndReturnArgs} args - Arguments to update many Tarifas.
     * @example
     * // Update many Tarifas
     * const tarifa = await prisma.tarifa.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tarifas and only return the `id`
     * const tarifaWithIdOnly = await prisma.tarifa.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TarifaUpdateManyAndReturnArgs>(args: SelectSubset<T, TarifaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tarifa.
     * @param {TarifaUpsertArgs} args - Arguments to update or create a Tarifa.
     * @example
     * // Update or create a Tarifa
     * const tarifa = await prisma.tarifa.upsert({
     *   create: {
     *     // ... data to create a Tarifa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tarifa we want to update
     *   }
     * })
     */
    upsert<T extends TarifaUpsertArgs>(args: SelectSubset<T, TarifaUpsertArgs<ExtArgs>>): Prisma__TarifaClient<$Result.GetResult<Prisma.$TarifaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tarifas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TarifaCountArgs} args - Arguments to filter Tarifas to count.
     * @example
     * // Count the number of Tarifas
     * const count = await prisma.tarifa.count({
     *   where: {
     *     // ... the filter for the Tarifas we want to count
     *   }
     * })
    **/
    count<T extends TarifaCountArgs>(
      args?: Subset<T, TarifaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TarifaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tarifa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TarifaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TarifaAggregateArgs>(args: Subset<T, TarifaAggregateArgs>): Prisma.PrismaPromise<GetTarifaAggregateType<T>>

    /**
     * Group by Tarifa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TarifaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TarifaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TarifaGroupByArgs['orderBy'] }
        : { orderBy?: TarifaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TarifaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTarifaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tarifa model
   */
  readonly fields: TarifaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tarifa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TarifaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tarifa model
   */
  interface TarifaFieldRefs {
    readonly id: FieldRef<"Tarifa", 'String'>
    readonly personas: FieldRef<"Tarifa", 'Int'>
    readonly precio: FieldRef<"Tarifa", 'Decimal'>
    readonly activa: FieldRef<"Tarifa", 'Boolean'>
    readonly createdAt: FieldRef<"Tarifa", 'DateTime'>
    readonly updatedAt: FieldRef<"Tarifa", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tarifa findUnique
   */
  export type TarifaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * Filter, which Tarifa to fetch.
     */
    where: TarifaWhereUniqueInput
  }

  /**
   * Tarifa findUniqueOrThrow
   */
  export type TarifaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * Filter, which Tarifa to fetch.
     */
    where: TarifaWhereUniqueInput
  }

  /**
   * Tarifa findFirst
   */
  export type TarifaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * Filter, which Tarifa to fetch.
     */
    where?: TarifaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tarifas to fetch.
     */
    orderBy?: TarifaOrderByWithRelationInput | TarifaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tarifas.
     */
    cursor?: TarifaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tarifas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tarifas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tarifas.
     */
    distinct?: TarifaScalarFieldEnum | TarifaScalarFieldEnum[]
  }

  /**
   * Tarifa findFirstOrThrow
   */
  export type TarifaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * Filter, which Tarifa to fetch.
     */
    where?: TarifaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tarifas to fetch.
     */
    orderBy?: TarifaOrderByWithRelationInput | TarifaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tarifas.
     */
    cursor?: TarifaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tarifas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tarifas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tarifas.
     */
    distinct?: TarifaScalarFieldEnum | TarifaScalarFieldEnum[]
  }

  /**
   * Tarifa findMany
   */
  export type TarifaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * Filter, which Tarifas to fetch.
     */
    where?: TarifaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tarifas to fetch.
     */
    orderBy?: TarifaOrderByWithRelationInput | TarifaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tarifas.
     */
    cursor?: TarifaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tarifas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tarifas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tarifas.
     */
    distinct?: TarifaScalarFieldEnum | TarifaScalarFieldEnum[]
  }

  /**
   * Tarifa create
   */
  export type TarifaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * The data needed to create a Tarifa.
     */
    data: XOR<TarifaCreateInput, TarifaUncheckedCreateInput>
  }

  /**
   * Tarifa createMany
   */
  export type TarifaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tarifas.
     */
    data: TarifaCreateManyInput | TarifaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tarifa createManyAndReturn
   */
  export type TarifaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * The data used to create many Tarifas.
     */
    data: TarifaCreateManyInput | TarifaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tarifa update
   */
  export type TarifaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * The data needed to update a Tarifa.
     */
    data: XOR<TarifaUpdateInput, TarifaUncheckedUpdateInput>
    /**
     * Choose, which Tarifa to update.
     */
    where: TarifaWhereUniqueInput
  }

  /**
   * Tarifa updateMany
   */
  export type TarifaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tarifas.
     */
    data: XOR<TarifaUpdateManyMutationInput, TarifaUncheckedUpdateManyInput>
    /**
     * Filter which Tarifas to update
     */
    where?: TarifaWhereInput
    /**
     * Limit how many Tarifas to update.
     */
    limit?: number
  }

  /**
   * Tarifa updateManyAndReturn
   */
  export type TarifaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * The data used to update Tarifas.
     */
    data: XOR<TarifaUpdateManyMutationInput, TarifaUncheckedUpdateManyInput>
    /**
     * Filter which Tarifas to update
     */
    where?: TarifaWhereInput
    /**
     * Limit how many Tarifas to update.
     */
    limit?: number
  }

  /**
   * Tarifa upsert
   */
  export type TarifaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * The filter to search for the Tarifa to update in case it exists.
     */
    where: TarifaWhereUniqueInput
    /**
     * In case the Tarifa found by the `where` argument doesn't exist, create a new Tarifa with this data.
     */
    create: XOR<TarifaCreateInput, TarifaUncheckedCreateInput>
    /**
     * In case the Tarifa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TarifaUpdateInput, TarifaUncheckedUpdateInput>
  }

  /**
   * Tarifa delete
   */
  export type TarifaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
    /**
     * Filter which Tarifa to delete.
     */
    where: TarifaWhereUniqueInput
  }

  /**
   * Tarifa deleteMany
   */
  export type TarifaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tarifas to delete
     */
    where?: TarifaWhereInput
    /**
     * Limit how many Tarifas to delete.
     */
    limit?: number
  }

  /**
   * Tarifa without action
   */
  export type TarifaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tarifa
     */
    select?: TarifaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tarifa
     */
    omit?: TarifaOmit<ExtArgs> | null
  }


  /**
   * Model Reserva
   */

  export type AggregateReserva = {
    _count: ReservaCountAggregateOutputType | null
    _avg: ReservaAvgAggregateOutputType | null
    _sum: ReservaSumAggregateOutputType | null
    _min: ReservaMinAggregateOutputType | null
    _max: ReservaMaxAggregateOutputType | null
  }

  export type ReservaAvgAggregateOutputType = {
    cantidadPersonas: number | null
    cantidadNoches: number | null
    precioPorNoche: Decimal | null
    precioTotal: Decimal | null
  }

  export type ReservaSumAggregateOutputType = {
    cantidadPersonas: number | null
    cantidadNoches: number | null
    precioPorNoche: Decimal | null
    precioTotal: Decimal | null
  }

  export type ReservaMinAggregateOutputType = {
    id: string | null
    codigo: string | null
    clienteId: string | null
    habitacionId: string | null
    fechaEntrada: Date | null
    fechaSalida: Date | null
    cantidadPersonas: number | null
    cantidadNoches: number | null
    precioPorNoche: Decimal | null
    precioTotal: Decimal | null
    estado: $Enums.EstadoReserva | null
    expiraEn: Date | null
    observaciones: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReservaMaxAggregateOutputType = {
    id: string | null
    codigo: string | null
    clienteId: string | null
    habitacionId: string | null
    fechaEntrada: Date | null
    fechaSalida: Date | null
    cantidadPersonas: number | null
    cantidadNoches: number | null
    precioPorNoche: Decimal | null
    precioTotal: Decimal | null
    estado: $Enums.EstadoReserva | null
    expiraEn: Date | null
    observaciones: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReservaCountAggregateOutputType = {
    id: number
    codigo: number
    clienteId: number
    habitacionId: number
    fechaEntrada: number
    fechaSalida: number
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: number
    precioTotal: number
    estado: number
    expiraEn: number
    observaciones: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReservaAvgAggregateInputType = {
    cantidadPersonas?: true
    cantidadNoches?: true
    precioPorNoche?: true
    precioTotal?: true
  }

  export type ReservaSumAggregateInputType = {
    cantidadPersonas?: true
    cantidadNoches?: true
    precioPorNoche?: true
    precioTotal?: true
  }

  export type ReservaMinAggregateInputType = {
    id?: true
    codigo?: true
    clienteId?: true
    habitacionId?: true
    fechaEntrada?: true
    fechaSalida?: true
    cantidadPersonas?: true
    cantidadNoches?: true
    precioPorNoche?: true
    precioTotal?: true
    estado?: true
    expiraEn?: true
    observaciones?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReservaMaxAggregateInputType = {
    id?: true
    codigo?: true
    clienteId?: true
    habitacionId?: true
    fechaEntrada?: true
    fechaSalida?: true
    cantidadPersonas?: true
    cantidadNoches?: true
    precioPorNoche?: true
    precioTotal?: true
    estado?: true
    expiraEn?: true
    observaciones?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReservaCountAggregateInputType = {
    id?: true
    codigo?: true
    clienteId?: true
    habitacionId?: true
    fechaEntrada?: true
    fechaSalida?: true
    cantidadPersonas?: true
    cantidadNoches?: true
    precioPorNoche?: true
    precioTotal?: true
    estado?: true
    expiraEn?: true
    observaciones?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReservaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reserva to aggregate.
     */
    where?: ReservaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservas to fetch.
     */
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reservas
    **/
    _count?: true | ReservaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReservaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReservaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservaMaxAggregateInputType
  }

  export type GetReservaAggregateType<T extends ReservaAggregateArgs> = {
        [P in keyof T & keyof AggregateReserva]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReserva[P]>
      : GetScalarType<T[P], AggregateReserva[P]>
  }




  export type ReservaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservaWhereInput
    orderBy?: ReservaOrderByWithAggregationInput | ReservaOrderByWithAggregationInput[]
    by: ReservaScalarFieldEnum[] | ReservaScalarFieldEnum
    having?: ReservaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservaCountAggregateInputType | true
    _avg?: ReservaAvgAggregateInputType
    _sum?: ReservaSumAggregateInputType
    _min?: ReservaMinAggregateInputType
    _max?: ReservaMaxAggregateInputType
  }

  export type ReservaGroupByOutputType = {
    id: string
    codigo: string
    clienteId: string
    habitacionId: string
    fechaEntrada: Date
    fechaSalida: Date
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal
    precioTotal: Decimal
    estado: $Enums.EstadoReserva
    expiraEn: Date | null
    observaciones: string | null
    createdAt: Date
    updatedAt: Date
    _count: ReservaCountAggregateOutputType | null
    _avg: ReservaAvgAggregateOutputType | null
    _sum: ReservaSumAggregateOutputType | null
    _min: ReservaMinAggregateOutputType | null
    _max: ReservaMaxAggregateOutputType | null
  }

  type GetReservaGroupByPayload<T extends ReservaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservaGroupByOutputType[P]>
            : GetScalarType<T[P], ReservaGroupByOutputType[P]>
        }
      >
    >


  export type ReservaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    codigo?: boolean
    clienteId?: boolean
    habitacionId?: boolean
    fechaEntrada?: boolean
    fechaSalida?: boolean
    cantidadPersonas?: boolean
    cantidadNoches?: boolean
    precioPorNoche?: boolean
    precioTotal?: boolean
    estado?: boolean
    expiraEn?: boolean
    observaciones?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    habitacion?: boolean | HabitacionDefaultArgs<ExtArgs>
    pago?: boolean | Reserva$pagoArgs<ExtArgs>
  }, ExtArgs["result"]["reserva"]>

  export type ReservaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    codigo?: boolean
    clienteId?: boolean
    habitacionId?: boolean
    fechaEntrada?: boolean
    fechaSalida?: boolean
    cantidadPersonas?: boolean
    cantidadNoches?: boolean
    precioPorNoche?: boolean
    precioTotal?: boolean
    estado?: boolean
    expiraEn?: boolean
    observaciones?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    habitacion?: boolean | HabitacionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reserva"]>

  export type ReservaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    codigo?: boolean
    clienteId?: boolean
    habitacionId?: boolean
    fechaEntrada?: boolean
    fechaSalida?: boolean
    cantidadPersonas?: boolean
    cantidadNoches?: boolean
    precioPorNoche?: boolean
    precioTotal?: boolean
    estado?: boolean
    expiraEn?: boolean
    observaciones?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    habitacion?: boolean | HabitacionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reserva"]>

  export type ReservaSelectScalar = {
    id?: boolean
    codigo?: boolean
    clienteId?: boolean
    habitacionId?: boolean
    fechaEntrada?: boolean
    fechaSalida?: boolean
    cantidadPersonas?: boolean
    cantidadNoches?: boolean
    precioPorNoche?: boolean
    precioTotal?: boolean
    estado?: boolean
    expiraEn?: boolean
    observaciones?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReservaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "codigo" | "clienteId" | "habitacionId" | "fechaEntrada" | "fechaSalida" | "cantidadPersonas" | "cantidadNoches" | "precioPorNoche" | "precioTotal" | "estado" | "expiraEn" | "observaciones" | "createdAt" | "updatedAt", ExtArgs["result"]["reserva"]>
  export type ReservaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    habitacion?: boolean | HabitacionDefaultArgs<ExtArgs>
    pago?: boolean | Reserva$pagoArgs<ExtArgs>
  }
  export type ReservaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    habitacion?: boolean | HabitacionDefaultArgs<ExtArgs>
  }
  export type ReservaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    habitacion?: boolean | HabitacionDefaultArgs<ExtArgs>
  }

  export type $ReservaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reserva"
    objects: {
      cliente: Prisma.$ClientePayload<ExtArgs>
      habitacion: Prisma.$HabitacionPayload<ExtArgs>
      pago: Prisma.$PagoPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      codigo: string
      clienteId: string
      habitacionId: string
      fechaEntrada: Date
      fechaSalida: Date
      cantidadPersonas: number
      cantidadNoches: number
      precioPorNoche: Prisma.Decimal
      precioTotal: Prisma.Decimal
      estado: $Enums.EstadoReserva
      expiraEn: Date | null
      observaciones: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["reserva"]>
    composites: {}
  }

  type ReservaGetPayload<S extends boolean | null | undefined | ReservaDefaultArgs> = $Result.GetResult<Prisma.$ReservaPayload, S>

  type ReservaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReservaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReservaCountAggregateInputType | true
    }

  export interface ReservaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reserva'], meta: { name: 'Reserva' } }
    /**
     * Find zero or one Reserva that matches the filter.
     * @param {ReservaFindUniqueArgs} args - Arguments to find a Reserva
     * @example
     * // Get one Reserva
     * const reserva = await prisma.reserva.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservaFindUniqueArgs>(args: SelectSubset<T, ReservaFindUniqueArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reserva that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReservaFindUniqueOrThrowArgs} args - Arguments to find a Reserva
     * @example
     * // Get one Reserva
     * const reserva = await prisma.reserva.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservaFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reserva that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaFindFirstArgs} args - Arguments to find a Reserva
     * @example
     * // Get one Reserva
     * const reserva = await prisma.reserva.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservaFindFirstArgs>(args?: SelectSubset<T, ReservaFindFirstArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reserva that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaFindFirstOrThrowArgs} args - Arguments to find a Reserva
     * @example
     * // Get one Reserva
     * const reserva = await prisma.reserva.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservaFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reservas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reservas
     * const reservas = await prisma.reserva.findMany()
     * 
     * // Get first 10 Reservas
     * const reservas = await prisma.reserva.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reservaWithIdOnly = await prisma.reserva.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReservaFindManyArgs>(args?: SelectSubset<T, ReservaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reserva.
     * @param {ReservaCreateArgs} args - Arguments to create a Reserva.
     * @example
     * // Create one Reserva
     * const Reserva = await prisma.reserva.create({
     *   data: {
     *     // ... data to create a Reserva
     *   }
     * })
     * 
     */
    create<T extends ReservaCreateArgs>(args: SelectSubset<T, ReservaCreateArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reservas.
     * @param {ReservaCreateManyArgs} args - Arguments to create many Reservas.
     * @example
     * // Create many Reservas
     * const reserva = await prisma.reserva.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservaCreateManyArgs>(args?: SelectSubset<T, ReservaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reservas and returns the data saved in the database.
     * @param {ReservaCreateManyAndReturnArgs} args - Arguments to create many Reservas.
     * @example
     * // Create many Reservas
     * const reserva = await prisma.reserva.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reservas and only return the `id`
     * const reservaWithIdOnly = await prisma.reserva.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReservaCreateManyAndReturnArgs>(args?: SelectSubset<T, ReservaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reserva.
     * @param {ReservaDeleteArgs} args - Arguments to delete one Reserva.
     * @example
     * // Delete one Reserva
     * const Reserva = await prisma.reserva.delete({
     *   where: {
     *     // ... filter to delete one Reserva
     *   }
     * })
     * 
     */
    delete<T extends ReservaDeleteArgs>(args: SelectSubset<T, ReservaDeleteArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reserva.
     * @param {ReservaUpdateArgs} args - Arguments to update one Reserva.
     * @example
     * // Update one Reserva
     * const reserva = await prisma.reserva.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservaUpdateArgs>(args: SelectSubset<T, ReservaUpdateArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reservas.
     * @param {ReservaDeleteManyArgs} args - Arguments to filter Reservas to delete.
     * @example
     * // Delete a few Reservas
     * const { count } = await prisma.reserva.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservaDeleteManyArgs>(args?: SelectSubset<T, ReservaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reservas
     * const reserva = await prisma.reserva.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservaUpdateManyArgs>(args: SelectSubset<T, ReservaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservas and returns the data updated in the database.
     * @param {ReservaUpdateManyAndReturnArgs} args - Arguments to update many Reservas.
     * @example
     * // Update many Reservas
     * const reserva = await prisma.reserva.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reservas and only return the `id`
     * const reservaWithIdOnly = await prisma.reserva.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReservaUpdateManyAndReturnArgs>(args: SelectSubset<T, ReservaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reserva.
     * @param {ReservaUpsertArgs} args - Arguments to update or create a Reserva.
     * @example
     * // Update or create a Reserva
     * const reserva = await prisma.reserva.upsert({
     *   create: {
     *     // ... data to create a Reserva
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reserva we want to update
     *   }
     * })
     */
    upsert<T extends ReservaUpsertArgs>(args: SelectSubset<T, ReservaUpsertArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reservas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaCountArgs} args - Arguments to filter Reservas to count.
     * @example
     * // Count the number of Reservas
     * const count = await prisma.reserva.count({
     *   where: {
     *     // ... the filter for the Reservas we want to count
     *   }
     * })
    **/
    count<T extends ReservaCountArgs>(
      args?: Subset<T, ReservaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reserva.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReservaAggregateArgs>(args: Subset<T, ReservaAggregateArgs>): Prisma.PrismaPromise<GetReservaAggregateType<T>>

    /**
     * Group by Reserva.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReservaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservaGroupByArgs['orderBy'] }
        : { orderBy?: ReservaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReservaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reserva model
   */
  readonly fields: ReservaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reserva.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cliente<T extends ClienteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClienteDefaultArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    habitacion<T extends HabitacionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HabitacionDefaultArgs<ExtArgs>>): Prisma__HabitacionClient<$Result.GetResult<Prisma.$HabitacionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pago<T extends Reserva$pagoArgs<ExtArgs> = {}>(args?: Subset<T, Reserva$pagoArgs<ExtArgs>>): Prisma__PagoClient<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reserva model
   */
  interface ReservaFieldRefs {
    readonly id: FieldRef<"Reserva", 'String'>
    readonly codigo: FieldRef<"Reserva", 'String'>
    readonly clienteId: FieldRef<"Reserva", 'String'>
    readonly habitacionId: FieldRef<"Reserva", 'String'>
    readonly fechaEntrada: FieldRef<"Reserva", 'DateTime'>
    readonly fechaSalida: FieldRef<"Reserva", 'DateTime'>
    readonly cantidadPersonas: FieldRef<"Reserva", 'Int'>
    readonly cantidadNoches: FieldRef<"Reserva", 'Int'>
    readonly precioPorNoche: FieldRef<"Reserva", 'Decimal'>
    readonly precioTotal: FieldRef<"Reserva", 'Decimal'>
    readonly estado: FieldRef<"Reserva", 'EstadoReserva'>
    readonly expiraEn: FieldRef<"Reserva", 'DateTime'>
    readonly observaciones: FieldRef<"Reserva", 'String'>
    readonly createdAt: FieldRef<"Reserva", 'DateTime'>
    readonly updatedAt: FieldRef<"Reserva", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Reserva findUnique
   */
  export type ReservaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter, which Reserva to fetch.
     */
    where: ReservaWhereUniqueInput
  }

  /**
   * Reserva findUniqueOrThrow
   */
  export type ReservaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter, which Reserva to fetch.
     */
    where: ReservaWhereUniqueInput
  }

  /**
   * Reserva findFirst
   */
  export type ReservaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter, which Reserva to fetch.
     */
    where?: ReservaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservas to fetch.
     */
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservas.
     */
    cursor?: ReservaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservas.
     */
    distinct?: ReservaScalarFieldEnum | ReservaScalarFieldEnum[]
  }

  /**
   * Reserva findFirstOrThrow
   */
  export type ReservaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter, which Reserva to fetch.
     */
    where?: ReservaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservas to fetch.
     */
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservas.
     */
    cursor?: ReservaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservas.
     */
    distinct?: ReservaScalarFieldEnum | ReservaScalarFieldEnum[]
  }

  /**
   * Reserva findMany
   */
  export type ReservaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter, which Reservas to fetch.
     */
    where?: ReservaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservas to fetch.
     */
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reservas.
     */
    cursor?: ReservaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservas.
     */
    distinct?: ReservaScalarFieldEnum | ReservaScalarFieldEnum[]
  }

  /**
   * Reserva create
   */
  export type ReservaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * The data needed to create a Reserva.
     */
    data: XOR<ReservaCreateInput, ReservaUncheckedCreateInput>
  }

  /**
   * Reserva createMany
   */
  export type ReservaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reservas.
     */
    data: ReservaCreateManyInput | ReservaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reserva createManyAndReturn
   */
  export type ReservaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * The data used to create many Reservas.
     */
    data: ReservaCreateManyInput | ReservaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reserva update
   */
  export type ReservaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * The data needed to update a Reserva.
     */
    data: XOR<ReservaUpdateInput, ReservaUncheckedUpdateInput>
    /**
     * Choose, which Reserva to update.
     */
    where: ReservaWhereUniqueInput
  }

  /**
   * Reserva updateMany
   */
  export type ReservaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reservas.
     */
    data: XOR<ReservaUpdateManyMutationInput, ReservaUncheckedUpdateManyInput>
    /**
     * Filter which Reservas to update
     */
    where?: ReservaWhereInput
    /**
     * Limit how many Reservas to update.
     */
    limit?: number
  }

  /**
   * Reserva updateManyAndReturn
   */
  export type ReservaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * The data used to update Reservas.
     */
    data: XOR<ReservaUpdateManyMutationInput, ReservaUncheckedUpdateManyInput>
    /**
     * Filter which Reservas to update
     */
    where?: ReservaWhereInput
    /**
     * Limit how many Reservas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reserva upsert
   */
  export type ReservaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * The filter to search for the Reserva to update in case it exists.
     */
    where: ReservaWhereUniqueInput
    /**
     * In case the Reserva found by the `where` argument doesn't exist, create a new Reserva with this data.
     */
    create: XOR<ReservaCreateInput, ReservaUncheckedCreateInput>
    /**
     * In case the Reserva was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservaUpdateInput, ReservaUncheckedUpdateInput>
  }

  /**
   * Reserva delete
   */
  export type ReservaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter which Reserva to delete.
     */
    where: ReservaWhereUniqueInput
  }

  /**
   * Reserva deleteMany
   */
  export type ReservaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservas to delete
     */
    where?: ReservaWhereInput
    /**
     * Limit how many Reservas to delete.
     */
    limit?: number
  }

  /**
   * Reserva.pago
   */
  export type Reserva$pagoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
    where?: PagoWhereInput
  }

  /**
   * Reserva without action
   */
  export type ReservaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
  }


  /**
   * Model Pago
   */

  export type AggregatePago = {
    _count: PagoCountAggregateOutputType | null
    _avg: PagoAvgAggregateOutputType | null
    _sum: PagoSumAggregateOutputType | null
    _min: PagoMinAggregateOutputType | null
    _max: PagoMaxAggregateOutputType | null
  }

  export type PagoAvgAggregateOutputType = {
    monto: Decimal | null
  }

  export type PagoSumAggregateOutputType = {
    monto: Decimal | null
  }

  export type PagoMinAggregateOutputType = {
    id: string | null
    reservaId: string | null
    proveedor: string | null
    referenciaExterna: string | null
    monto: Decimal | null
    moneda: string | null
    estado: $Enums.EstadoPago | null
    urlPago: string | null
    fechaPago: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PagoMaxAggregateOutputType = {
    id: string | null
    reservaId: string | null
    proveedor: string | null
    referenciaExterna: string | null
    monto: Decimal | null
    moneda: string | null
    estado: $Enums.EstadoPago | null
    urlPago: string | null
    fechaPago: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PagoCountAggregateOutputType = {
    id: number
    reservaId: number
    proveedor: number
    referenciaExterna: number
    monto: number
    moneda: number
    estado: number
    urlPago: number
    fechaPago: number
    respuestaProveedor: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PagoAvgAggregateInputType = {
    monto?: true
  }

  export type PagoSumAggregateInputType = {
    monto?: true
  }

  export type PagoMinAggregateInputType = {
    id?: true
    reservaId?: true
    proveedor?: true
    referenciaExterna?: true
    monto?: true
    moneda?: true
    estado?: true
    urlPago?: true
    fechaPago?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PagoMaxAggregateInputType = {
    id?: true
    reservaId?: true
    proveedor?: true
    referenciaExterna?: true
    monto?: true
    moneda?: true
    estado?: true
    urlPago?: true
    fechaPago?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PagoCountAggregateInputType = {
    id?: true
    reservaId?: true
    proveedor?: true
    referenciaExterna?: true
    monto?: true
    moneda?: true
    estado?: true
    urlPago?: true
    fechaPago?: true
    respuestaProveedor?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PagoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pago to aggregate.
     */
    where?: PagoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagos to fetch.
     */
    orderBy?: PagoOrderByWithRelationInput | PagoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PagoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pagos
    **/
    _count?: true | PagoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PagoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PagoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PagoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PagoMaxAggregateInputType
  }

  export type GetPagoAggregateType<T extends PagoAggregateArgs> = {
        [P in keyof T & keyof AggregatePago]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePago[P]>
      : GetScalarType<T[P], AggregatePago[P]>
  }




  export type PagoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PagoWhereInput
    orderBy?: PagoOrderByWithAggregationInput | PagoOrderByWithAggregationInput[]
    by: PagoScalarFieldEnum[] | PagoScalarFieldEnum
    having?: PagoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PagoCountAggregateInputType | true
    _avg?: PagoAvgAggregateInputType
    _sum?: PagoSumAggregateInputType
    _min?: PagoMinAggregateInputType
    _max?: PagoMaxAggregateInputType
  }

  export type PagoGroupByOutputType = {
    id: string
    reservaId: string
    proveedor: string
    referenciaExterna: string | null
    monto: Decimal
    moneda: string
    estado: $Enums.EstadoPago
    urlPago: string | null
    fechaPago: Date | null
    respuestaProveedor: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: PagoCountAggregateOutputType | null
    _avg: PagoAvgAggregateOutputType | null
    _sum: PagoSumAggregateOutputType | null
    _min: PagoMinAggregateOutputType | null
    _max: PagoMaxAggregateOutputType | null
  }

  type GetPagoGroupByPayload<T extends PagoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PagoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PagoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PagoGroupByOutputType[P]>
            : GetScalarType<T[P], PagoGroupByOutputType[P]>
        }
      >
    >


  export type PagoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reservaId?: boolean
    proveedor?: boolean
    referenciaExterna?: boolean
    monto?: boolean
    moneda?: boolean
    estado?: boolean
    urlPago?: boolean
    fechaPago?: boolean
    respuestaProveedor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reserva?: boolean | ReservaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pago"]>

  export type PagoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reservaId?: boolean
    proveedor?: boolean
    referenciaExterna?: boolean
    monto?: boolean
    moneda?: boolean
    estado?: boolean
    urlPago?: boolean
    fechaPago?: boolean
    respuestaProveedor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reserva?: boolean | ReservaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pago"]>

  export type PagoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reservaId?: boolean
    proveedor?: boolean
    referenciaExterna?: boolean
    monto?: boolean
    moneda?: boolean
    estado?: boolean
    urlPago?: boolean
    fechaPago?: boolean
    respuestaProveedor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reserva?: boolean | ReservaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pago"]>

  export type PagoSelectScalar = {
    id?: boolean
    reservaId?: boolean
    proveedor?: boolean
    referenciaExterna?: boolean
    monto?: boolean
    moneda?: boolean
    estado?: boolean
    urlPago?: boolean
    fechaPago?: boolean
    respuestaProveedor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PagoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "reservaId" | "proveedor" | "referenciaExterna" | "monto" | "moneda" | "estado" | "urlPago" | "fechaPago" | "respuestaProveedor" | "createdAt" | "updatedAt", ExtArgs["result"]["pago"]>
  export type PagoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reserva?: boolean | ReservaDefaultArgs<ExtArgs>
  }
  export type PagoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reserva?: boolean | ReservaDefaultArgs<ExtArgs>
  }
  export type PagoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reserva?: boolean | ReservaDefaultArgs<ExtArgs>
  }

  export type $PagoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pago"
    objects: {
      reserva: Prisma.$ReservaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      reservaId: string
      proveedor: string
      referenciaExterna: string | null
      monto: Prisma.Decimal
      moneda: string
      estado: $Enums.EstadoPago
      urlPago: string | null
      fechaPago: Date | null
      respuestaProveedor: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pago"]>
    composites: {}
  }

  type PagoGetPayload<S extends boolean | null | undefined | PagoDefaultArgs> = $Result.GetResult<Prisma.$PagoPayload, S>

  type PagoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PagoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PagoCountAggregateInputType | true
    }

  export interface PagoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pago'], meta: { name: 'Pago' } }
    /**
     * Find zero or one Pago that matches the filter.
     * @param {PagoFindUniqueArgs} args - Arguments to find a Pago
     * @example
     * // Get one Pago
     * const pago = await prisma.pago.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PagoFindUniqueArgs>(args: SelectSubset<T, PagoFindUniqueArgs<ExtArgs>>): Prisma__PagoClient<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pago that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PagoFindUniqueOrThrowArgs} args - Arguments to find a Pago
     * @example
     * // Get one Pago
     * const pago = await prisma.pago.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PagoFindUniqueOrThrowArgs>(args: SelectSubset<T, PagoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PagoClient<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pago that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagoFindFirstArgs} args - Arguments to find a Pago
     * @example
     * // Get one Pago
     * const pago = await prisma.pago.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PagoFindFirstArgs>(args?: SelectSubset<T, PagoFindFirstArgs<ExtArgs>>): Prisma__PagoClient<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pago that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagoFindFirstOrThrowArgs} args - Arguments to find a Pago
     * @example
     * // Get one Pago
     * const pago = await prisma.pago.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PagoFindFirstOrThrowArgs>(args?: SelectSubset<T, PagoFindFirstOrThrowArgs<ExtArgs>>): Prisma__PagoClient<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pagos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pagos
     * const pagos = await prisma.pago.findMany()
     * 
     * // Get first 10 Pagos
     * const pagos = await prisma.pago.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pagoWithIdOnly = await prisma.pago.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PagoFindManyArgs>(args?: SelectSubset<T, PagoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pago.
     * @param {PagoCreateArgs} args - Arguments to create a Pago.
     * @example
     * // Create one Pago
     * const Pago = await prisma.pago.create({
     *   data: {
     *     // ... data to create a Pago
     *   }
     * })
     * 
     */
    create<T extends PagoCreateArgs>(args: SelectSubset<T, PagoCreateArgs<ExtArgs>>): Prisma__PagoClient<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pagos.
     * @param {PagoCreateManyArgs} args - Arguments to create many Pagos.
     * @example
     * // Create many Pagos
     * const pago = await prisma.pago.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PagoCreateManyArgs>(args?: SelectSubset<T, PagoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pagos and returns the data saved in the database.
     * @param {PagoCreateManyAndReturnArgs} args - Arguments to create many Pagos.
     * @example
     * // Create many Pagos
     * const pago = await prisma.pago.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pagos and only return the `id`
     * const pagoWithIdOnly = await prisma.pago.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PagoCreateManyAndReturnArgs>(args?: SelectSubset<T, PagoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pago.
     * @param {PagoDeleteArgs} args - Arguments to delete one Pago.
     * @example
     * // Delete one Pago
     * const Pago = await prisma.pago.delete({
     *   where: {
     *     // ... filter to delete one Pago
     *   }
     * })
     * 
     */
    delete<T extends PagoDeleteArgs>(args: SelectSubset<T, PagoDeleteArgs<ExtArgs>>): Prisma__PagoClient<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pago.
     * @param {PagoUpdateArgs} args - Arguments to update one Pago.
     * @example
     * // Update one Pago
     * const pago = await prisma.pago.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PagoUpdateArgs>(args: SelectSubset<T, PagoUpdateArgs<ExtArgs>>): Prisma__PagoClient<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pagos.
     * @param {PagoDeleteManyArgs} args - Arguments to filter Pagos to delete.
     * @example
     * // Delete a few Pagos
     * const { count } = await prisma.pago.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PagoDeleteManyArgs>(args?: SelectSubset<T, PagoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pagos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pagos
     * const pago = await prisma.pago.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PagoUpdateManyArgs>(args: SelectSubset<T, PagoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pagos and returns the data updated in the database.
     * @param {PagoUpdateManyAndReturnArgs} args - Arguments to update many Pagos.
     * @example
     * // Update many Pagos
     * const pago = await prisma.pago.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pagos and only return the `id`
     * const pagoWithIdOnly = await prisma.pago.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PagoUpdateManyAndReturnArgs>(args: SelectSubset<T, PagoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pago.
     * @param {PagoUpsertArgs} args - Arguments to update or create a Pago.
     * @example
     * // Update or create a Pago
     * const pago = await prisma.pago.upsert({
     *   create: {
     *     // ... data to create a Pago
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pago we want to update
     *   }
     * })
     */
    upsert<T extends PagoUpsertArgs>(args: SelectSubset<T, PagoUpsertArgs<ExtArgs>>): Prisma__PagoClient<$Result.GetResult<Prisma.$PagoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pagos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagoCountArgs} args - Arguments to filter Pagos to count.
     * @example
     * // Count the number of Pagos
     * const count = await prisma.pago.count({
     *   where: {
     *     // ... the filter for the Pagos we want to count
     *   }
     * })
    **/
    count<T extends PagoCountArgs>(
      args?: Subset<T, PagoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PagoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pago.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PagoAggregateArgs>(args: Subset<T, PagoAggregateArgs>): Prisma.PrismaPromise<GetPagoAggregateType<T>>

    /**
     * Group by Pago.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PagoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PagoGroupByArgs['orderBy'] }
        : { orderBy?: PagoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PagoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPagoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pago model
   */
  readonly fields: PagoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pago.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PagoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reserva<T extends ReservaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReservaDefaultArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pago model
   */
  interface PagoFieldRefs {
    readonly id: FieldRef<"Pago", 'String'>
    readonly reservaId: FieldRef<"Pago", 'String'>
    readonly proveedor: FieldRef<"Pago", 'String'>
    readonly referenciaExterna: FieldRef<"Pago", 'String'>
    readonly monto: FieldRef<"Pago", 'Decimal'>
    readonly moneda: FieldRef<"Pago", 'String'>
    readonly estado: FieldRef<"Pago", 'EstadoPago'>
    readonly urlPago: FieldRef<"Pago", 'String'>
    readonly fechaPago: FieldRef<"Pago", 'DateTime'>
    readonly respuestaProveedor: FieldRef<"Pago", 'Json'>
    readonly createdAt: FieldRef<"Pago", 'DateTime'>
    readonly updatedAt: FieldRef<"Pago", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pago findUnique
   */
  export type PagoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
    /**
     * Filter, which Pago to fetch.
     */
    where: PagoWhereUniqueInput
  }

  /**
   * Pago findUniqueOrThrow
   */
  export type PagoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
    /**
     * Filter, which Pago to fetch.
     */
    where: PagoWhereUniqueInput
  }

  /**
   * Pago findFirst
   */
  export type PagoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
    /**
     * Filter, which Pago to fetch.
     */
    where?: PagoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagos to fetch.
     */
    orderBy?: PagoOrderByWithRelationInput | PagoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pagos.
     */
    cursor?: PagoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pagos.
     */
    distinct?: PagoScalarFieldEnum | PagoScalarFieldEnum[]
  }

  /**
   * Pago findFirstOrThrow
   */
  export type PagoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
    /**
     * Filter, which Pago to fetch.
     */
    where?: PagoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagos to fetch.
     */
    orderBy?: PagoOrderByWithRelationInput | PagoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pagos.
     */
    cursor?: PagoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pagos.
     */
    distinct?: PagoScalarFieldEnum | PagoScalarFieldEnum[]
  }

  /**
   * Pago findMany
   */
  export type PagoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
    /**
     * Filter, which Pagos to fetch.
     */
    where?: PagoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagos to fetch.
     */
    orderBy?: PagoOrderByWithRelationInput | PagoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pagos.
     */
    cursor?: PagoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pagos.
     */
    distinct?: PagoScalarFieldEnum | PagoScalarFieldEnum[]
  }

  /**
   * Pago create
   */
  export type PagoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
    /**
     * The data needed to create a Pago.
     */
    data: XOR<PagoCreateInput, PagoUncheckedCreateInput>
  }

  /**
   * Pago createMany
   */
  export type PagoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pagos.
     */
    data: PagoCreateManyInput | PagoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pago createManyAndReturn
   */
  export type PagoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * The data used to create many Pagos.
     */
    data: PagoCreateManyInput | PagoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pago update
   */
  export type PagoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
    /**
     * The data needed to update a Pago.
     */
    data: XOR<PagoUpdateInput, PagoUncheckedUpdateInput>
    /**
     * Choose, which Pago to update.
     */
    where: PagoWhereUniqueInput
  }

  /**
   * Pago updateMany
   */
  export type PagoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pagos.
     */
    data: XOR<PagoUpdateManyMutationInput, PagoUncheckedUpdateManyInput>
    /**
     * Filter which Pagos to update
     */
    where?: PagoWhereInput
    /**
     * Limit how many Pagos to update.
     */
    limit?: number
  }

  /**
   * Pago updateManyAndReturn
   */
  export type PagoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * The data used to update Pagos.
     */
    data: XOR<PagoUpdateManyMutationInput, PagoUncheckedUpdateManyInput>
    /**
     * Filter which Pagos to update
     */
    where?: PagoWhereInput
    /**
     * Limit how many Pagos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pago upsert
   */
  export type PagoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
    /**
     * The filter to search for the Pago to update in case it exists.
     */
    where: PagoWhereUniqueInput
    /**
     * In case the Pago found by the `where` argument doesn't exist, create a new Pago with this data.
     */
    create: XOR<PagoCreateInput, PagoUncheckedCreateInput>
    /**
     * In case the Pago was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PagoUpdateInput, PagoUncheckedUpdateInput>
  }

  /**
   * Pago delete
   */
  export type PagoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
    /**
     * Filter which Pago to delete.
     */
    where: PagoWhereUniqueInput
  }

  /**
   * Pago deleteMany
   */
  export type PagoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pagos to delete
     */
    where?: PagoWhereInput
    /**
     * Limit how many Pagos to delete.
     */
    limit?: number
  }

  /**
   * Pago without action
   */
  export type PagoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pago
     */
    select?: PagoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pago
     */
    omit?: PagoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagoInclude<ExtArgs> | null
  }


  /**
   * Model ImagenHabitacion
   */

  export type AggregateImagenHabitacion = {
    _count: ImagenHabitacionCountAggregateOutputType | null
    _avg: ImagenHabitacionAvgAggregateOutputType | null
    _sum: ImagenHabitacionSumAggregateOutputType | null
    _min: ImagenHabitacionMinAggregateOutputType | null
    _max: ImagenHabitacionMaxAggregateOutputType | null
  }

  export type ImagenHabitacionAvgAggregateOutputType = {
    orden: number | null
  }

  export type ImagenHabitacionSumAggregateOutputType = {
    orden: number | null
  }

  export type ImagenHabitacionMinAggregateOutputType = {
    id: string | null
    url: string | null
    descripcion: string | null
    orden: number | null
    activa: boolean | null
    createdAt: Date | null
  }

  export type ImagenHabitacionMaxAggregateOutputType = {
    id: string | null
    url: string | null
    descripcion: string | null
    orden: number | null
    activa: boolean | null
    createdAt: Date | null
  }

  export type ImagenHabitacionCountAggregateOutputType = {
    id: number
    url: number
    descripcion: number
    orden: number
    activa: number
    createdAt: number
    _all: number
  }


  export type ImagenHabitacionAvgAggregateInputType = {
    orden?: true
  }

  export type ImagenHabitacionSumAggregateInputType = {
    orden?: true
  }

  export type ImagenHabitacionMinAggregateInputType = {
    id?: true
    url?: true
    descripcion?: true
    orden?: true
    activa?: true
    createdAt?: true
  }

  export type ImagenHabitacionMaxAggregateInputType = {
    id?: true
    url?: true
    descripcion?: true
    orden?: true
    activa?: true
    createdAt?: true
  }

  export type ImagenHabitacionCountAggregateInputType = {
    id?: true
    url?: true
    descripcion?: true
    orden?: true
    activa?: true
    createdAt?: true
    _all?: true
  }

  export type ImagenHabitacionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImagenHabitacion to aggregate.
     */
    where?: ImagenHabitacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagenHabitacions to fetch.
     */
    orderBy?: ImagenHabitacionOrderByWithRelationInput | ImagenHabitacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImagenHabitacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagenHabitacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagenHabitacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImagenHabitacions
    **/
    _count?: true | ImagenHabitacionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImagenHabitacionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImagenHabitacionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImagenHabitacionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImagenHabitacionMaxAggregateInputType
  }

  export type GetImagenHabitacionAggregateType<T extends ImagenHabitacionAggregateArgs> = {
        [P in keyof T & keyof AggregateImagenHabitacion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImagenHabitacion[P]>
      : GetScalarType<T[P], AggregateImagenHabitacion[P]>
  }




  export type ImagenHabitacionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImagenHabitacionWhereInput
    orderBy?: ImagenHabitacionOrderByWithAggregationInput | ImagenHabitacionOrderByWithAggregationInput[]
    by: ImagenHabitacionScalarFieldEnum[] | ImagenHabitacionScalarFieldEnum
    having?: ImagenHabitacionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImagenHabitacionCountAggregateInputType | true
    _avg?: ImagenHabitacionAvgAggregateInputType
    _sum?: ImagenHabitacionSumAggregateInputType
    _min?: ImagenHabitacionMinAggregateInputType
    _max?: ImagenHabitacionMaxAggregateInputType
  }

  export type ImagenHabitacionGroupByOutputType = {
    id: string
    url: string
    descripcion: string | null
    orden: number
    activa: boolean
    createdAt: Date
    _count: ImagenHabitacionCountAggregateOutputType | null
    _avg: ImagenHabitacionAvgAggregateOutputType | null
    _sum: ImagenHabitacionSumAggregateOutputType | null
    _min: ImagenHabitacionMinAggregateOutputType | null
    _max: ImagenHabitacionMaxAggregateOutputType | null
  }

  type GetImagenHabitacionGroupByPayload<T extends ImagenHabitacionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImagenHabitacionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImagenHabitacionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImagenHabitacionGroupByOutputType[P]>
            : GetScalarType<T[P], ImagenHabitacionGroupByOutputType[P]>
        }
      >
    >


  export type ImagenHabitacionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    descripcion?: boolean
    orden?: boolean
    activa?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["imagenHabitacion"]>

  export type ImagenHabitacionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    descripcion?: boolean
    orden?: boolean
    activa?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["imagenHabitacion"]>

  export type ImagenHabitacionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    descripcion?: boolean
    orden?: boolean
    activa?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["imagenHabitacion"]>

  export type ImagenHabitacionSelectScalar = {
    id?: boolean
    url?: boolean
    descripcion?: boolean
    orden?: boolean
    activa?: boolean
    createdAt?: boolean
  }

  export type ImagenHabitacionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "descripcion" | "orden" | "activa" | "createdAt", ExtArgs["result"]["imagenHabitacion"]>

  export type $ImagenHabitacionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImagenHabitacion"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      descripcion: string | null
      orden: number
      activa: boolean
      createdAt: Date
    }, ExtArgs["result"]["imagenHabitacion"]>
    composites: {}
  }

  type ImagenHabitacionGetPayload<S extends boolean | null | undefined | ImagenHabitacionDefaultArgs> = $Result.GetResult<Prisma.$ImagenHabitacionPayload, S>

  type ImagenHabitacionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImagenHabitacionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImagenHabitacionCountAggregateInputType | true
    }

  export interface ImagenHabitacionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImagenHabitacion'], meta: { name: 'ImagenHabitacion' } }
    /**
     * Find zero or one ImagenHabitacion that matches the filter.
     * @param {ImagenHabitacionFindUniqueArgs} args - Arguments to find a ImagenHabitacion
     * @example
     * // Get one ImagenHabitacion
     * const imagenHabitacion = await prisma.imagenHabitacion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImagenHabitacionFindUniqueArgs>(args: SelectSubset<T, ImagenHabitacionFindUniqueArgs<ExtArgs>>): Prisma__ImagenHabitacionClient<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImagenHabitacion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImagenHabitacionFindUniqueOrThrowArgs} args - Arguments to find a ImagenHabitacion
     * @example
     * // Get one ImagenHabitacion
     * const imagenHabitacion = await prisma.imagenHabitacion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImagenHabitacionFindUniqueOrThrowArgs>(args: SelectSubset<T, ImagenHabitacionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImagenHabitacionClient<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImagenHabitacion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagenHabitacionFindFirstArgs} args - Arguments to find a ImagenHabitacion
     * @example
     * // Get one ImagenHabitacion
     * const imagenHabitacion = await prisma.imagenHabitacion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImagenHabitacionFindFirstArgs>(args?: SelectSubset<T, ImagenHabitacionFindFirstArgs<ExtArgs>>): Prisma__ImagenHabitacionClient<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImagenHabitacion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagenHabitacionFindFirstOrThrowArgs} args - Arguments to find a ImagenHabitacion
     * @example
     * // Get one ImagenHabitacion
     * const imagenHabitacion = await prisma.imagenHabitacion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImagenHabitacionFindFirstOrThrowArgs>(args?: SelectSubset<T, ImagenHabitacionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImagenHabitacionClient<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImagenHabitacions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagenHabitacionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImagenHabitacions
     * const imagenHabitacions = await prisma.imagenHabitacion.findMany()
     * 
     * // Get first 10 ImagenHabitacions
     * const imagenHabitacions = await prisma.imagenHabitacion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imagenHabitacionWithIdOnly = await prisma.imagenHabitacion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImagenHabitacionFindManyArgs>(args?: SelectSubset<T, ImagenHabitacionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImagenHabitacion.
     * @param {ImagenHabitacionCreateArgs} args - Arguments to create a ImagenHabitacion.
     * @example
     * // Create one ImagenHabitacion
     * const ImagenHabitacion = await prisma.imagenHabitacion.create({
     *   data: {
     *     // ... data to create a ImagenHabitacion
     *   }
     * })
     * 
     */
    create<T extends ImagenHabitacionCreateArgs>(args: SelectSubset<T, ImagenHabitacionCreateArgs<ExtArgs>>): Prisma__ImagenHabitacionClient<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImagenHabitacions.
     * @param {ImagenHabitacionCreateManyArgs} args - Arguments to create many ImagenHabitacions.
     * @example
     * // Create many ImagenHabitacions
     * const imagenHabitacion = await prisma.imagenHabitacion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImagenHabitacionCreateManyArgs>(args?: SelectSubset<T, ImagenHabitacionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImagenHabitacions and returns the data saved in the database.
     * @param {ImagenHabitacionCreateManyAndReturnArgs} args - Arguments to create many ImagenHabitacions.
     * @example
     * // Create many ImagenHabitacions
     * const imagenHabitacion = await prisma.imagenHabitacion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImagenHabitacions and only return the `id`
     * const imagenHabitacionWithIdOnly = await prisma.imagenHabitacion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImagenHabitacionCreateManyAndReturnArgs>(args?: SelectSubset<T, ImagenHabitacionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImagenHabitacion.
     * @param {ImagenHabitacionDeleteArgs} args - Arguments to delete one ImagenHabitacion.
     * @example
     * // Delete one ImagenHabitacion
     * const ImagenHabitacion = await prisma.imagenHabitacion.delete({
     *   where: {
     *     // ... filter to delete one ImagenHabitacion
     *   }
     * })
     * 
     */
    delete<T extends ImagenHabitacionDeleteArgs>(args: SelectSubset<T, ImagenHabitacionDeleteArgs<ExtArgs>>): Prisma__ImagenHabitacionClient<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImagenHabitacion.
     * @param {ImagenHabitacionUpdateArgs} args - Arguments to update one ImagenHabitacion.
     * @example
     * // Update one ImagenHabitacion
     * const imagenHabitacion = await prisma.imagenHabitacion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImagenHabitacionUpdateArgs>(args: SelectSubset<T, ImagenHabitacionUpdateArgs<ExtArgs>>): Prisma__ImagenHabitacionClient<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImagenHabitacions.
     * @param {ImagenHabitacionDeleteManyArgs} args - Arguments to filter ImagenHabitacions to delete.
     * @example
     * // Delete a few ImagenHabitacions
     * const { count } = await prisma.imagenHabitacion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImagenHabitacionDeleteManyArgs>(args?: SelectSubset<T, ImagenHabitacionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImagenHabitacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagenHabitacionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImagenHabitacions
     * const imagenHabitacion = await prisma.imagenHabitacion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImagenHabitacionUpdateManyArgs>(args: SelectSubset<T, ImagenHabitacionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImagenHabitacions and returns the data updated in the database.
     * @param {ImagenHabitacionUpdateManyAndReturnArgs} args - Arguments to update many ImagenHabitacions.
     * @example
     * // Update many ImagenHabitacions
     * const imagenHabitacion = await prisma.imagenHabitacion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImagenHabitacions and only return the `id`
     * const imagenHabitacionWithIdOnly = await prisma.imagenHabitacion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ImagenHabitacionUpdateManyAndReturnArgs>(args: SelectSubset<T, ImagenHabitacionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImagenHabitacion.
     * @param {ImagenHabitacionUpsertArgs} args - Arguments to update or create a ImagenHabitacion.
     * @example
     * // Update or create a ImagenHabitacion
     * const imagenHabitacion = await prisma.imagenHabitacion.upsert({
     *   create: {
     *     // ... data to create a ImagenHabitacion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImagenHabitacion we want to update
     *   }
     * })
     */
    upsert<T extends ImagenHabitacionUpsertArgs>(args: SelectSubset<T, ImagenHabitacionUpsertArgs<ExtArgs>>): Prisma__ImagenHabitacionClient<$Result.GetResult<Prisma.$ImagenHabitacionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImagenHabitacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagenHabitacionCountArgs} args - Arguments to filter ImagenHabitacions to count.
     * @example
     * // Count the number of ImagenHabitacions
     * const count = await prisma.imagenHabitacion.count({
     *   where: {
     *     // ... the filter for the ImagenHabitacions we want to count
     *   }
     * })
    **/
    count<T extends ImagenHabitacionCountArgs>(
      args?: Subset<T, ImagenHabitacionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImagenHabitacionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImagenHabitacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagenHabitacionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImagenHabitacionAggregateArgs>(args: Subset<T, ImagenHabitacionAggregateArgs>): Prisma.PrismaPromise<GetImagenHabitacionAggregateType<T>>

    /**
     * Group by ImagenHabitacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagenHabitacionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImagenHabitacionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImagenHabitacionGroupByArgs['orderBy'] }
        : { orderBy?: ImagenHabitacionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImagenHabitacionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImagenHabitacionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImagenHabitacion model
   */
  readonly fields: ImagenHabitacionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImagenHabitacion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImagenHabitacionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ImagenHabitacion model
   */
  interface ImagenHabitacionFieldRefs {
    readonly id: FieldRef<"ImagenHabitacion", 'String'>
    readonly url: FieldRef<"ImagenHabitacion", 'String'>
    readonly descripcion: FieldRef<"ImagenHabitacion", 'String'>
    readonly orden: FieldRef<"ImagenHabitacion", 'Int'>
    readonly activa: FieldRef<"ImagenHabitacion", 'Boolean'>
    readonly createdAt: FieldRef<"ImagenHabitacion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImagenHabitacion findUnique
   */
  export type ImagenHabitacionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * Filter, which ImagenHabitacion to fetch.
     */
    where: ImagenHabitacionWhereUniqueInput
  }

  /**
   * ImagenHabitacion findUniqueOrThrow
   */
  export type ImagenHabitacionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * Filter, which ImagenHabitacion to fetch.
     */
    where: ImagenHabitacionWhereUniqueInput
  }

  /**
   * ImagenHabitacion findFirst
   */
  export type ImagenHabitacionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * Filter, which ImagenHabitacion to fetch.
     */
    where?: ImagenHabitacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagenHabitacions to fetch.
     */
    orderBy?: ImagenHabitacionOrderByWithRelationInput | ImagenHabitacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImagenHabitacions.
     */
    cursor?: ImagenHabitacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagenHabitacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagenHabitacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImagenHabitacions.
     */
    distinct?: ImagenHabitacionScalarFieldEnum | ImagenHabitacionScalarFieldEnum[]
  }

  /**
   * ImagenHabitacion findFirstOrThrow
   */
  export type ImagenHabitacionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * Filter, which ImagenHabitacion to fetch.
     */
    where?: ImagenHabitacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagenHabitacions to fetch.
     */
    orderBy?: ImagenHabitacionOrderByWithRelationInput | ImagenHabitacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImagenHabitacions.
     */
    cursor?: ImagenHabitacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagenHabitacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagenHabitacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImagenHabitacions.
     */
    distinct?: ImagenHabitacionScalarFieldEnum | ImagenHabitacionScalarFieldEnum[]
  }

  /**
   * ImagenHabitacion findMany
   */
  export type ImagenHabitacionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * Filter, which ImagenHabitacions to fetch.
     */
    where?: ImagenHabitacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagenHabitacions to fetch.
     */
    orderBy?: ImagenHabitacionOrderByWithRelationInput | ImagenHabitacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImagenHabitacions.
     */
    cursor?: ImagenHabitacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagenHabitacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagenHabitacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImagenHabitacions.
     */
    distinct?: ImagenHabitacionScalarFieldEnum | ImagenHabitacionScalarFieldEnum[]
  }

  /**
   * ImagenHabitacion create
   */
  export type ImagenHabitacionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * The data needed to create a ImagenHabitacion.
     */
    data: XOR<ImagenHabitacionCreateInput, ImagenHabitacionUncheckedCreateInput>
  }

  /**
   * ImagenHabitacion createMany
   */
  export type ImagenHabitacionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImagenHabitacions.
     */
    data: ImagenHabitacionCreateManyInput | ImagenHabitacionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImagenHabitacion createManyAndReturn
   */
  export type ImagenHabitacionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * The data used to create many ImagenHabitacions.
     */
    data: ImagenHabitacionCreateManyInput | ImagenHabitacionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImagenHabitacion update
   */
  export type ImagenHabitacionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * The data needed to update a ImagenHabitacion.
     */
    data: XOR<ImagenHabitacionUpdateInput, ImagenHabitacionUncheckedUpdateInput>
    /**
     * Choose, which ImagenHabitacion to update.
     */
    where: ImagenHabitacionWhereUniqueInput
  }

  /**
   * ImagenHabitacion updateMany
   */
  export type ImagenHabitacionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImagenHabitacions.
     */
    data: XOR<ImagenHabitacionUpdateManyMutationInput, ImagenHabitacionUncheckedUpdateManyInput>
    /**
     * Filter which ImagenHabitacions to update
     */
    where?: ImagenHabitacionWhereInput
    /**
     * Limit how many ImagenHabitacions to update.
     */
    limit?: number
  }

  /**
   * ImagenHabitacion updateManyAndReturn
   */
  export type ImagenHabitacionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * The data used to update ImagenHabitacions.
     */
    data: XOR<ImagenHabitacionUpdateManyMutationInput, ImagenHabitacionUncheckedUpdateManyInput>
    /**
     * Filter which ImagenHabitacions to update
     */
    where?: ImagenHabitacionWhereInput
    /**
     * Limit how many ImagenHabitacions to update.
     */
    limit?: number
  }

  /**
   * ImagenHabitacion upsert
   */
  export type ImagenHabitacionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * The filter to search for the ImagenHabitacion to update in case it exists.
     */
    where: ImagenHabitacionWhereUniqueInput
    /**
     * In case the ImagenHabitacion found by the `where` argument doesn't exist, create a new ImagenHabitacion with this data.
     */
    create: XOR<ImagenHabitacionCreateInput, ImagenHabitacionUncheckedCreateInput>
    /**
     * In case the ImagenHabitacion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImagenHabitacionUpdateInput, ImagenHabitacionUncheckedUpdateInput>
  }

  /**
   * ImagenHabitacion delete
   */
  export type ImagenHabitacionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
    /**
     * Filter which ImagenHabitacion to delete.
     */
    where: ImagenHabitacionWhereUniqueInput
  }

  /**
   * ImagenHabitacion deleteMany
   */
  export type ImagenHabitacionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImagenHabitacions to delete
     */
    where?: ImagenHabitacionWhereInput
    /**
     * Limit how many ImagenHabitacions to delete.
     */
    limit?: number
  }

  /**
   * ImagenHabitacion without action
   */
  export type ImagenHabitacionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagenHabitacion
     */
    select?: ImagenHabitacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImagenHabitacion
     */
    omit?: ImagenHabitacionOmit<ExtArgs> | null
  }


  /**
   * Model Conversation
   */

  export type AggregateConversation = {
    _count: ConversationCountAggregateOutputType | null
    _avg: ConversationAvgAggregateOutputType | null
    _sum: ConversationSumAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  export type ConversationAvgAggregateOutputType = {
    cantidadPersonas: number | null
  }

  export type ConversationSumAggregateOutputType = {
    cantidadPersonas: number | null
  }

  export type ConversationMinAggregateOutputType = {
    id: string | null
    telefono: string | null
    mode: $Enums.ConversationMode | null
    step: $Enums.BookingStep | null
    nombreCliente: string | null
    fechaEntrada: Date | null
    fechaSalida: Date | null
    cantidadPersonas: number | null
    reservaId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ultimaDisponibilidadAt: Date | null
  }

  export type ConversationMaxAggregateOutputType = {
    id: string | null
    telefono: string | null
    mode: $Enums.ConversationMode | null
    step: $Enums.BookingStep | null
    nombreCliente: string | null
    fechaEntrada: Date | null
    fechaSalida: Date | null
    cantidadPersonas: number | null
    reservaId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ultimaDisponibilidadAt: Date | null
  }

  export type ConversationCountAggregateOutputType = {
    id: number
    telefono: number
    mode: number
    step: number
    nombreCliente: number
    fechaEntrada: number
    fechaSalida: number
    cantidadPersonas: number
    reservaId: number
    createdAt: number
    updatedAt: number
    ultimaDisponibilidadAt: number
    _all: number
  }


  export type ConversationAvgAggregateInputType = {
    cantidadPersonas?: true
  }

  export type ConversationSumAggregateInputType = {
    cantidadPersonas?: true
  }

  export type ConversationMinAggregateInputType = {
    id?: true
    telefono?: true
    mode?: true
    step?: true
    nombreCliente?: true
    fechaEntrada?: true
    fechaSalida?: true
    cantidadPersonas?: true
    reservaId?: true
    createdAt?: true
    updatedAt?: true
    ultimaDisponibilidadAt?: true
  }

  export type ConversationMaxAggregateInputType = {
    id?: true
    telefono?: true
    mode?: true
    step?: true
    nombreCliente?: true
    fechaEntrada?: true
    fechaSalida?: true
    cantidadPersonas?: true
    reservaId?: true
    createdAt?: true
    updatedAt?: true
    ultimaDisponibilidadAt?: true
  }

  export type ConversationCountAggregateInputType = {
    id?: true
    telefono?: true
    mode?: true
    step?: true
    nombreCliente?: true
    fechaEntrada?: true
    fechaSalida?: true
    cantidadPersonas?: true
    reservaId?: true
    createdAt?: true
    updatedAt?: true
    ultimaDisponibilidadAt?: true
    _all?: true
  }

  export type ConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversation to aggregate.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Conversations
    **/
    _count?: true | ConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConversationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConversationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationMaxAggregateInputType
  }

  export type GetConversationAggregateType<T extends ConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversation[P]>
      : GetScalarType<T[P], AggregateConversation[P]>
  }




  export type ConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithAggregationInput | ConversationOrderByWithAggregationInput[]
    by: ConversationScalarFieldEnum[] | ConversationScalarFieldEnum
    having?: ConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationCountAggregateInputType | true
    _avg?: ConversationAvgAggregateInputType
    _sum?: ConversationSumAggregateInputType
    _min?: ConversationMinAggregateInputType
    _max?: ConversationMaxAggregateInputType
  }

  export type ConversationGroupByOutputType = {
    id: string
    telefono: string
    mode: $Enums.ConversationMode
    step: $Enums.BookingStep
    nombreCliente: string | null
    fechaEntrada: Date | null
    fechaSalida: Date | null
    cantidadPersonas: number | null
    reservaId: string | null
    createdAt: Date
    updatedAt: Date
    ultimaDisponibilidadAt: Date | null
    _count: ConversationCountAggregateOutputType | null
    _avg: ConversationAvgAggregateOutputType | null
    _sum: ConversationSumAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  type GetConversationGroupByPayload<T extends ConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationGroupByOutputType[P]>
        }
      >
    >


  export type ConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    telefono?: boolean
    mode?: boolean
    step?: boolean
    nombreCliente?: boolean
    fechaEntrada?: boolean
    fechaSalida?: boolean
    cantidadPersonas?: boolean
    reservaId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ultimaDisponibilidadAt?: boolean
    messages?: boolean | Conversation$messagesArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    telefono?: boolean
    mode?: boolean
    step?: boolean
    nombreCliente?: boolean
    fechaEntrada?: boolean
    fechaSalida?: boolean
    cantidadPersonas?: boolean
    reservaId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ultimaDisponibilidadAt?: boolean
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    telefono?: boolean
    mode?: boolean
    step?: boolean
    nombreCliente?: boolean
    fechaEntrada?: boolean
    fechaSalida?: boolean
    cantidadPersonas?: boolean
    reservaId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ultimaDisponibilidadAt?: boolean
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectScalar = {
    id?: boolean
    telefono?: boolean
    mode?: boolean
    step?: boolean
    nombreCliente?: boolean
    fechaEntrada?: boolean
    fechaSalida?: boolean
    cantidadPersonas?: boolean
    reservaId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ultimaDisponibilidadAt?: boolean
  }

  export type ConversationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "telefono" | "mode" | "step" | "nombreCliente" | "fechaEntrada" | "fechaSalida" | "cantidadPersonas" | "reservaId" | "createdAt" | "updatedAt" | "ultimaDisponibilidadAt", ExtArgs["result"]["conversation"]>
  export type ConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | Conversation$messagesArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ConversationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Conversation"
    objects: {
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      telefono: string
      mode: $Enums.ConversationMode
      step: $Enums.BookingStep
      nombreCliente: string | null
      fechaEntrada: Date | null
      fechaSalida: Date | null
      cantidadPersonas: number | null
      reservaId: string | null
      createdAt: Date
      updatedAt: Date
      ultimaDisponibilidadAt: Date | null
    }, ExtArgs["result"]["conversation"]>
    composites: {}
  }

  type ConversationGetPayload<S extends boolean | null | undefined | ConversationDefaultArgs> = $Result.GetResult<Prisma.$ConversationPayload, S>

  type ConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversationCountAggregateInputType | true
    }

  export interface ConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Conversation'], meta: { name: 'Conversation' } }
    /**
     * Find zero or one Conversation that matches the filter.
     * @param {ConversationFindUniqueArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationFindUniqueArgs>(args: SelectSubset<T, ConversationFindUniqueArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Conversation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversationFindUniqueOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationFindFirstArgs>(args?: SelectSubset<T, ConversationFindFirstArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Conversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Conversations
     * const conversations = await prisma.conversation.findMany()
     * 
     * // Get first 10 Conversations
     * const conversations = await prisma.conversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationWithIdOnly = await prisma.conversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationFindManyArgs>(args?: SelectSubset<T, ConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Conversation.
     * @param {ConversationCreateArgs} args - Arguments to create a Conversation.
     * @example
     * // Create one Conversation
     * const Conversation = await prisma.conversation.create({
     *   data: {
     *     // ... data to create a Conversation
     *   }
     * })
     * 
     */
    create<T extends ConversationCreateArgs>(args: SelectSubset<T, ConversationCreateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Conversations.
     * @param {ConversationCreateManyArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationCreateManyArgs>(args?: SelectSubset<T, ConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Conversations and returns the data saved in the database.
     * @param {ConversationCreateManyAndReturnArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Conversations and only return the `id`
     * const conversationWithIdOnly = await prisma.conversation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Conversation.
     * @param {ConversationDeleteArgs} args - Arguments to delete one Conversation.
     * @example
     * // Delete one Conversation
     * const Conversation = await prisma.conversation.delete({
     *   where: {
     *     // ... filter to delete one Conversation
     *   }
     * })
     * 
     */
    delete<T extends ConversationDeleteArgs>(args: SelectSubset<T, ConversationDeleteArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Conversation.
     * @param {ConversationUpdateArgs} args - Arguments to update one Conversation.
     * @example
     * // Update one Conversation
     * const conversation = await prisma.conversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationUpdateArgs>(args: SelectSubset<T, ConversationUpdateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Conversations.
     * @param {ConversationDeleteManyArgs} args - Arguments to filter Conversations to delete.
     * @example
     * // Delete a few Conversations
     * const { count } = await prisma.conversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationDeleteManyArgs>(args?: SelectSubset<T, ConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationUpdateManyArgs>(args: SelectSubset<T, ConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations and returns the data updated in the database.
     * @param {ConversationUpdateManyAndReturnArgs} args - Arguments to update many Conversations.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Conversations and only return the `id`
     * const conversationWithIdOnly = await prisma.conversation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConversationUpdateManyAndReturnArgs>(args: SelectSubset<T, ConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Conversation.
     * @param {ConversationUpsertArgs} args - Arguments to update or create a Conversation.
     * @example
     * // Update or create a Conversation
     * const conversation = await prisma.conversation.upsert({
     *   create: {
     *     // ... data to create a Conversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Conversation we want to update
     *   }
     * })
     */
    upsert<T extends ConversationUpsertArgs>(args: SelectSubset<T, ConversationUpsertArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationCountArgs} args - Arguments to filter Conversations to count.
     * @example
     * // Count the number of Conversations
     * const count = await prisma.conversation.count({
     *   where: {
     *     // ... the filter for the Conversations we want to count
     *   }
     * })
    **/
    count<T extends ConversationCountArgs>(
      args?: Subset<T, ConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversationAggregateArgs>(args: Subset<T, ConversationAggregateArgs>): Prisma.PrismaPromise<GetConversationAggregateType<T>>

    /**
     * Group by Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationGroupByArgs['orderBy'] }
        : { orderBy?: ConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Conversation model
   */
  readonly fields: ConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Conversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends Conversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Conversation model
   */
  interface ConversationFieldRefs {
    readonly id: FieldRef<"Conversation", 'String'>
    readonly telefono: FieldRef<"Conversation", 'String'>
    readonly mode: FieldRef<"Conversation", 'ConversationMode'>
    readonly step: FieldRef<"Conversation", 'BookingStep'>
    readonly nombreCliente: FieldRef<"Conversation", 'String'>
    readonly fechaEntrada: FieldRef<"Conversation", 'DateTime'>
    readonly fechaSalida: FieldRef<"Conversation", 'DateTime'>
    readonly cantidadPersonas: FieldRef<"Conversation", 'Int'>
    readonly reservaId: FieldRef<"Conversation", 'String'>
    readonly createdAt: FieldRef<"Conversation", 'DateTime'>
    readonly updatedAt: FieldRef<"Conversation", 'DateTime'>
    readonly ultimaDisponibilidadAt: FieldRef<"Conversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Conversation findUnique
   */
  export type ConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findUniqueOrThrow
   */
  export type ConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findFirst
   */
  export type ConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findFirstOrThrow
   */
  export type ConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findMany
   */
  export type ConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversations to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation create
   */
  export type ConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a Conversation.
     */
    data: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
  }

  /**
   * Conversation createMany
   */
  export type ConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conversation createManyAndReturn
   */
  export type ConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conversation update
   */
  export type ConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a Conversation.
     */
    data: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
    /**
     * Choose, which Conversation to update.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation updateMany
   */
  export type ConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to update.
     */
    limit?: number
  }

  /**
   * Conversation updateManyAndReturn
   */
  export type ConversationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to update.
     */
    limit?: number
  }

  /**
   * Conversation upsert
   */
  export type ConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the Conversation to update in case it exists.
     */
    where: ConversationWhereUniqueInput
    /**
     * In case the Conversation found by the `where` argument doesn't exist, create a new Conversation with this data.
     */
    create: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
    /**
     * In case the Conversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
  }

  /**
   * Conversation delete
   */
  export type ConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter which Conversation to delete.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation deleteMany
   */
  export type ConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversations to delete
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to delete.
     */
    limit?: number
  }

  /**
   * Conversation.messages
   */
  export type Conversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Conversation without action
   */
  export type ConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: $Enums.MessageRole | null
    content: string | null
    toolName: string | null
    createdAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: $Enums.MessageRole | null
    content: string | null
    toolName: string | null
    createdAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    conversationId: number
    role: number
    content: number
    toolName: number
    toolData: number
    createdAt: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    toolName?: true
    createdAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    toolName?: true
    createdAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    toolName?: true
    toolData?: true
    createdAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    conversationId: string
    role: $Enums.MessageRole
    content: string
    toolName: string | null
    toolData: JsonValue | null
    createdAt: Date
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    toolName?: boolean
    toolData?: boolean
    createdAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    toolName?: boolean
    toolData?: boolean
    createdAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    toolName?: boolean
    toolData?: boolean
    createdAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    toolName?: boolean
    toolData?: boolean
    createdAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "conversationId" | "role" | "content" | "toolName" | "toolData" | "createdAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      conversation: Prisma.$ConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      role: $Enums.MessageRole
      content: string
      toolName: string | null
      toolData: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends ConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConversationDefaultArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly conversationId: FieldRef<"Message", 'String'>
    readonly role: FieldRef<"Message", 'MessageRole'>
    readonly content: FieldRef<"Message", 'String'>
    readonly toolName: FieldRef<"Message", 'String'>
    readonly toolData: FieldRef<"Message", 'Json'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const HabitacionScalarFieldEnum: {
    id: 'id',
    numero: 'numero',
    capacidad: 'capacidad',
    estado: 'estado',
    activa: 'activa',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type HabitacionScalarFieldEnum = (typeof HabitacionScalarFieldEnum)[keyof typeof HabitacionScalarFieldEnum]


  export const ClienteScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    telefono: 'telefono',
    correo: 'correo',
    documento: 'documento',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClienteScalarFieldEnum = (typeof ClienteScalarFieldEnum)[keyof typeof ClienteScalarFieldEnum]


  export const TarifaScalarFieldEnum: {
    id: 'id',
    personas: 'personas',
    precio: 'precio',
    activa: 'activa',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TarifaScalarFieldEnum = (typeof TarifaScalarFieldEnum)[keyof typeof TarifaScalarFieldEnum]


  export const ReservaScalarFieldEnum: {
    id: 'id',
    codigo: 'codigo',
    clienteId: 'clienteId',
    habitacionId: 'habitacionId',
    fechaEntrada: 'fechaEntrada',
    fechaSalida: 'fechaSalida',
    cantidadPersonas: 'cantidadPersonas',
    cantidadNoches: 'cantidadNoches',
    precioPorNoche: 'precioPorNoche',
    precioTotal: 'precioTotal',
    estado: 'estado',
    expiraEn: 'expiraEn',
    observaciones: 'observaciones',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReservaScalarFieldEnum = (typeof ReservaScalarFieldEnum)[keyof typeof ReservaScalarFieldEnum]


  export const PagoScalarFieldEnum: {
    id: 'id',
    reservaId: 'reservaId',
    proveedor: 'proveedor',
    referenciaExterna: 'referenciaExterna',
    monto: 'monto',
    moneda: 'moneda',
    estado: 'estado',
    urlPago: 'urlPago',
    fechaPago: 'fechaPago',
    respuestaProveedor: 'respuestaProveedor',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PagoScalarFieldEnum = (typeof PagoScalarFieldEnum)[keyof typeof PagoScalarFieldEnum]


  export const ImagenHabitacionScalarFieldEnum: {
    id: 'id',
    url: 'url',
    descripcion: 'descripcion',
    orden: 'orden',
    activa: 'activa',
    createdAt: 'createdAt'
  };

  export type ImagenHabitacionScalarFieldEnum = (typeof ImagenHabitacionScalarFieldEnum)[keyof typeof ImagenHabitacionScalarFieldEnum]


  export const ConversationScalarFieldEnum: {
    id: 'id',
    telefono: 'telefono',
    mode: 'mode',
    step: 'step',
    nombreCliente: 'nombreCliente',
    fechaEntrada: 'fechaEntrada',
    fechaSalida: 'fechaSalida',
    cantidadPersonas: 'cantidadPersonas',
    reservaId: 'reservaId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ultimaDisponibilidadAt: 'ultimaDisponibilidadAt'
  };

  export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    role: 'role',
    content: 'content',
    toolName: 'toolName',
    toolData: 'toolData',
    createdAt: 'createdAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'EstadoHabitacion'
   */
  export type EnumEstadoHabitacionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoHabitacion'>
    


  /**
   * Reference to a field of type 'EstadoHabitacion[]'
   */
  export type ListEnumEstadoHabitacionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoHabitacion[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'EstadoReserva'
   */
  export type EnumEstadoReservaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoReserva'>
    


  /**
   * Reference to a field of type 'EstadoReserva[]'
   */
  export type ListEnumEstadoReservaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoReserva[]'>
    


  /**
   * Reference to a field of type 'EstadoPago'
   */
  export type EnumEstadoPagoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoPago'>
    


  /**
   * Reference to a field of type 'EstadoPago[]'
   */
  export type ListEnumEstadoPagoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoPago[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'ConversationMode'
   */
  export type EnumConversationModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationMode'>
    


  /**
   * Reference to a field of type 'ConversationMode[]'
   */
  export type ListEnumConversationModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationMode[]'>
    


  /**
   * Reference to a field of type 'BookingStep'
   */
  export type EnumBookingStepFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStep'>
    


  /**
   * Reference to a field of type 'BookingStep[]'
   */
  export type ListEnumBookingStepFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStep[]'>
    


  /**
   * Reference to a field of type 'MessageRole'
   */
  export type EnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageRole'>
    


  /**
   * Reference to a field of type 'MessageRole[]'
   */
  export type ListEnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageRole[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type HabitacionWhereInput = {
    AND?: HabitacionWhereInput | HabitacionWhereInput[]
    OR?: HabitacionWhereInput[]
    NOT?: HabitacionWhereInput | HabitacionWhereInput[]
    id?: StringFilter<"Habitacion"> | string
    numero?: StringFilter<"Habitacion"> | string
    capacidad?: IntFilter<"Habitacion"> | number
    estado?: EnumEstadoHabitacionFilter<"Habitacion"> | $Enums.EstadoHabitacion
    activa?: BoolFilter<"Habitacion"> | boolean
    createdAt?: DateTimeFilter<"Habitacion"> | Date | string
    updatedAt?: DateTimeFilter<"Habitacion"> | Date | string
    reservas?: ReservaListRelationFilter
  }

  export type HabitacionOrderByWithRelationInput = {
    id?: SortOrder
    numero?: SortOrder
    capacidad?: SortOrder
    estado?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reservas?: ReservaOrderByRelationAggregateInput
  }

  export type HabitacionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    numero?: string
    AND?: HabitacionWhereInput | HabitacionWhereInput[]
    OR?: HabitacionWhereInput[]
    NOT?: HabitacionWhereInput | HabitacionWhereInput[]
    capacidad?: IntFilter<"Habitacion"> | number
    estado?: EnumEstadoHabitacionFilter<"Habitacion"> | $Enums.EstadoHabitacion
    activa?: BoolFilter<"Habitacion"> | boolean
    createdAt?: DateTimeFilter<"Habitacion"> | Date | string
    updatedAt?: DateTimeFilter<"Habitacion"> | Date | string
    reservas?: ReservaListRelationFilter
  }, "id" | "numero">

  export type HabitacionOrderByWithAggregationInput = {
    id?: SortOrder
    numero?: SortOrder
    capacidad?: SortOrder
    estado?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: HabitacionCountOrderByAggregateInput
    _avg?: HabitacionAvgOrderByAggregateInput
    _max?: HabitacionMaxOrderByAggregateInput
    _min?: HabitacionMinOrderByAggregateInput
    _sum?: HabitacionSumOrderByAggregateInput
  }

  export type HabitacionScalarWhereWithAggregatesInput = {
    AND?: HabitacionScalarWhereWithAggregatesInput | HabitacionScalarWhereWithAggregatesInput[]
    OR?: HabitacionScalarWhereWithAggregatesInput[]
    NOT?: HabitacionScalarWhereWithAggregatesInput | HabitacionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Habitacion"> | string
    numero?: StringWithAggregatesFilter<"Habitacion"> | string
    capacidad?: IntWithAggregatesFilter<"Habitacion"> | number
    estado?: EnumEstadoHabitacionWithAggregatesFilter<"Habitacion"> | $Enums.EstadoHabitacion
    activa?: BoolWithAggregatesFilter<"Habitacion"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Habitacion"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Habitacion"> | Date | string
  }

  export type ClienteWhereInput = {
    AND?: ClienteWhereInput | ClienteWhereInput[]
    OR?: ClienteWhereInput[]
    NOT?: ClienteWhereInput | ClienteWhereInput[]
    id?: StringFilter<"Cliente"> | string
    nombre?: StringFilter<"Cliente"> | string
    telefono?: StringFilter<"Cliente"> | string
    correo?: StringNullableFilter<"Cliente"> | string | null
    documento?: StringNullableFilter<"Cliente"> | string | null
    createdAt?: DateTimeFilter<"Cliente"> | Date | string
    updatedAt?: DateTimeFilter<"Cliente"> | Date | string
    reservas?: ReservaListRelationFilter
  }

  export type ClienteOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    telefono?: SortOrder
    correo?: SortOrderInput | SortOrder
    documento?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reservas?: ReservaOrderByRelationAggregateInput
  }

  export type ClienteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    telefono?: string
    AND?: ClienteWhereInput | ClienteWhereInput[]
    OR?: ClienteWhereInput[]
    NOT?: ClienteWhereInput | ClienteWhereInput[]
    nombre?: StringFilter<"Cliente"> | string
    correo?: StringNullableFilter<"Cliente"> | string | null
    documento?: StringNullableFilter<"Cliente"> | string | null
    createdAt?: DateTimeFilter<"Cliente"> | Date | string
    updatedAt?: DateTimeFilter<"Cliente"> | Date | string
    reservas?: ReservaListRelationFilter
  }, "id" | "telefono">

  export type ClienteOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    telefono?: SortOrder
    correo?: SortOrderInput | SortOrder
    documento?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClienteCountOrderByAggregateInput
    _max?: ClienteMaxOrderByAggregateInput
    _min?: ClienteMinOrderByAggregateInput
  }

  export type ClienteScalarWhereWithAggregatesInput = {
    AND?: ClienteScalarWhereWithAggregatesInput | ClienteScalarWhereWithAggregatesInput[]
    OR?: ClienteScalarWhereWithAggregatesInput[]
    NOT?: ClienteScalarWhereWithAggregatesInput | ClienteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Cliente"> | string
    nombre?: StringWithAggregatesFilter<"Cliente"> | string
    telefono?: StringWithAggregatesFilter<"Cliente"> | string
    correo?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    documento?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Cliente"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Cliente"> | Date | string
  }

  export type TarifaWhereInput = {
    AND?: TarifaWhereInput | TarifaWhereInput[]
    OR?: TarifaWhereInput[]
    NOT?: TarifaWhereInput | TarifaWhereInput[]
    id?: StringFilter<"Tarifa"> | string
    personas?: IntFilter<"Tarifa"> | number
    precio?: DecimalFilter<"Tarifa"> | Decimal | DecimalJsLike | number | string
    activa?: BoolFilter<"Tarifa"> | boolean
    createdAt?: DateTimeFilter<"Tarifa"> | Date | string
    updatedAt?: DateTimeFilter<"Tarifa"> | Date | string
  }

  export type TarifaOrderByWithRelationInput = {
    id?: SortOrder
    personas?: SortOrder
    precio?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TarifaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    personas?: number
    AND?: TarifaWhereInput | TarifaWhereInput[]
    OR?: TarifaWhereInput[]
    NOT?: TarifaWhereInput | TarifaWhereInput[]
    precio?: DecimalFilter<"Tarifa"> | Decimal | DecimalJsLike | number | string
    activa?: BoolFilter<"Tarifa"> | boolean
    createdAt?: DateTimeFilter<"Tarifa"> | Date | string
    updatedAt?: DateTimeFilter<"Tarifa"> | Date | string
  }, "id" | "personas">

  export type TarifaOrderByWithAggregationInput = {
    id?: SortOrder
    personas?: SortOrder
    precio?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TarifaCountOrderByAggregateInput
    _avg?: TarifaAvgOrderByAggregateInput
    _max?: TarifaMaxOrderByAggregateInput
    _min?: TarifaMinOrderByAggregateInput
    _sum?: TarifaSumOrderByAggregateInput
  }

  export type TarifaScalarWhereWithAggregatesInput = {
    AND?: TarifaScalarWhereWithAggregatesInput | TarifaScalarWhereWithAggregatesInput[]
    OR?: TarifaScalarWhereWithAggregatesInput[]
    NOT?: TarifaScalarWhereWithAggregatesInput | TarifaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tarifa"> | string
    personas?: IntWithAggregatesFilter<"Tarifa"> | number
    precio?: DecimalWithAggregatesFilter<"Tarifa"> | Decimal | DecimalJsLike | number | string
    activa?: BoolWithAggregatesFilter<"Tarifa"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Tarifa"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tarifa"> | Date | string
  }

  export type ReservaWhereInput = {
    AND?: ReservaWhereInput | ReservaWhereInput[]
    OR?: ReservaWhereInput[]
    NOT?: ReservaWhereInput | ReservaWhereInput[]
    id?: StringFilter<"Reserva"> | string
    codigo?: StringFilter<"Reserva"> | string
    clienteId?: StringFilter<"Reserva"> | string
    habitacionId?: StringFilter<"Reserva"> | string
    fechaEntrada?: DateTimeFilter<"Reserva"> | Date | string
    fechaSalida?: DateTimeFilter<"Reserva"> | Date | string
    cantidadPersonas?: IntFilter<"Reserva"> | number
    cantidadNoches?: IntFilter<"Reserva"> | number
    precioPorNoche?: DecimalFilter<"Reserva"> | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFilter<"Reserva"> | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFilter<"Reserva"> | $Enums.EstadoReserva
    expiraEn?: DateTimeNullableFilter<"Reserva"> | Date | string | null
    observaciones?: StringNullableFilter<"Reserva"> | string | null
    createdAt?: DateTimeFilter<"Reserva"> | Date | string
    updatedAt?: DateTimeFilter<"Reserva"> | Date | string
    cliente?: XOR<ClienteScalarRelationFilter, ClienteWhereInput>
    habitacion?: XOR<HabitacionScalarRelationFilter, HabitacionWhereInput>
    pago?: XOR<PagoNullableScalarRelationFilter, PagoWhereInput> | null
  }

  export type ReservaOrderByWithRelationInput = {
    id?: SortOrder
    codigo?: SortOrder
    clienteId?: SortOrder
    habitacionId?: SortOrder
    fechaEntrada?: SortOrder
    fechaSalida?: SortOrder
    cantidadPersonas?: SortOrder
    cantidadNoches?: SortOrder
    precioPorNoche?: SortOrder
    precioTotal?: SortOrder
    estado?: SortOrder
    expiraEn?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cliente?: ClienteOrderByWithRelationInput
    habitacion?: HabitacionOrderByWithRelationInput
    pago?: PagoOrderByWithRelationInput
  }

  export type ReservaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    codigo?: string
    AND?: ReservaWhereInput | ReservaWhereInput[]
    OR?: ReservaWhereInput[]
    NOT?: ReservaWhereInput | ReservaWhereInput[]
    clienteId?: StringFilter<"Reserva"> | string
    habitacionId?: StringFilter<"Reserva"> | string
    fechaEntrada?: DateTimeFilter<"Reserva"> | Date | string
    fechaSalida?: DateTimeFilter<"Reserva"> | Date | string
    cantidadPersonas?: IntFilter<"Reserva"> | number
    cantidadNoches?: IntFilter<"Reserva"> | number
    precioPorNoche?: DecimalFilter<"Reserva"> | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFilter<"Reserva"> | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFilter<"Reserva"> | $Enums.EstadoReserva
    expiraEn?: DateTimeNullableFilter<"Reserva"> | Date | string | null
    observaciones?: StringNullableFilter<"Reserva"> | string | null
    createdAt?: DateTimeFilter<"Reserva"> | Date | string
    updatedAt?: DateTimeFilter<"Reserva"> | Date | string
    cliente?: XOR<ClienteScalarRelationFilter, ClienteWhereInput>
    habitacion?: XOR<HabitacionScalarRelationFilter, HabitacionWhereInput>
    pago?: XOR<PagoNullableScalarRelationFilter, PagoWhereInput> | null
  }, "id" | "codigo">

  export type ReservaOrderByWithAggregationInput = {
    id?: SortOrder
    codigo?: SortOrder
    clienteId?: SortOrder
    habitacionId?: SortOrder
    fechaEntrada?: SortOrder
    fechaSalida?: SortOrder
    cantidadPersonas?: SortOrder
    cantidadNoches?: SortOrder
    precioPorNoche?: SortOrder
    precioTotal?: SortOrder
    estado?: SortOrder
    expiraEn?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReservaCountOrderByAggregateInput
    _avg?: ReservaAvgOrderByAggregateInput
    _max?: ReservaMaxOrderByAggregateInput
    _min?: ReservaMinOrderByAggregateInput
    _sum?: ReservaSumOrderByAggregateInput
  }

  export type ReservaScalarWhereWithAggregatesInput = {
    AND?: ReservaScalarWhereWithAggregatesInput | ReservaScalarWhereWithAggregatesInput[]
    OR?: ReservaScalarWhereWithAggregatesInput[]
    NOT?: ReservaScalarWhereWithAggregatesInput | ReservaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reserva"> | string
    codigo?: StringWithAggregatesFilter<"Reserva"> | string
    clienteId?: StringWithAggregatesFilter<"Reserva"> | string
    habitacionId?: StringWithAggregatesFilter<"Reserva"> | string
    fechaEntrada?: DateTimeWithAggregatesFilter<"Reserva"> | Date | string
    fechaSalida?: DateTimeWithAggregatesFilter<"Reserva"> | Date | string
    cantidadPersonas?: IntWithAggregatesFilter<"Reserva"> | number
    cantidadNoches?: IntWithAggregatesFilter<"Reserva"> | number
    precioPorNoche?: DecimalWithAggregatesFilter<"Reserva"> | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalWithAggregatesFilter<"Reserva"> | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaWithAggregatesFilter<"Reserva"> | $Enums.EstadoReserva
    expiraEn?: DateTimeNullableWithAggregatesFilter<"Reserva"> | Date | string | null
    observaciones?: StringNullableWithAggregatesFilter<"Reserva"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Reserva"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Reserva"> | Date | string
  }

  export type PagoWhereInput = {
    AND?: PagoWhereInput | PagoWhereInput[]
    OR?: PagoWhereInput[]
    NOT?: PagoWhereInput | PagoWhereInput[]
    id?: StringFilter<"Pago"> | string
    reservaId?: StringFilter<"Pago"> | string
    proveedor?: StringFilter<"Pago"> | string
    referenciaExterna?: StringNullableFilter<"Pago"> | string | null
    monto?: DecimalFilter<"Pago"> | Decimal | DecimalJsLike | number | string
    moneda?: StringFilter<"Pago"> | string
    estado?: EnumEstadoPagoFilter<"Pago"> | $Enums.EstadoPago
    urlPago?: StringNullableFilter<"Pago"> | string | null
    fechaPago?: DateTimeNullableFilter<"Pago"> | Date | string | null
    respuestaProveedor?: JsonNullableFilter<"Pago">
    createdAt?: DateTimeFilter<"Pago"> | Date | string
    updatedAt?: DateTimeFilter<"Pago"> | Date | string
    reserva?: XOR<ReservaScalarRelationFilter, ReservaWhereInput>
  }

  export type PagoOrderByWithRelationInput = {
    id?: SortOrder
    reservaId?: SortOrder
    proveedor?: SortOrder
    referenciaExterna?: SortOrderInput | SortOrder
    monto?: SortOrder
    moneda?: SortOrder
    estado?: SortOrder
    urlPago?: SortOrderInput | SortOrder
    fechaPago?: SortOrderInput | SortOrder
    respuestaProveedor?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reserva?: ReservaOrderByWithRelationInput
  }

  export type PagoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    reservaId?: string
    referenciaExterna?: string
    AND?: PagoWhereInput | PagoWhereInput[]
    OR?: PagoWhereInput[]
    NOT?: PagoWhereInput | PagoWhereInput[]
    proveedor?: StringFilter<"Pago"> | string
    monto?: DecimalFilter<"Pago"> | Decimal | DecimalJsLike | number | string
    moneda?: StringFilter<"Pago"> | string
    estado?: EnumEstadoPagoFilter<"Pago"> | $Enums.EstadoPago
    urlPago?: StringNullableFilter<"Pago"> | string | null
    fechaPago?: DateTimeNullableFilter<"Pago"> | Date | string | null
    respuestaProveedor?: JsonNullableFilter<"Pago">
    createdAt?: DateTimeFilter<"Pago"> | Date | string
    updatedAt?: DateTimeFilter<"Pago"> | Date | string
    reserva?: XOR<ReservaScalarRelationFilter, ReservaWhereInput>
  }, "id" | "reservaId" | "referenciaExterna">

  export type PagoOrderByWithAggregationInput = {
    id?: SortOrder
    reservaId?: SortOrder
    proveedor?: SortOrder
    referenciaExterna?: SortOrderInput | SortOrder
    monto?: SortOrder
    moneda?: SortOrder
    estado?: SortOrder
    urlPago?: SortOrderInput | SortOrder
    fechaPago?: SortOrderInput | SortOrder
    respuestaProveedor?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PagoCountOrderByAggregateInput
    _avg?: PagoAvgOrderByAggregateInput
    _max?: PagoMaxOrderByAggregateInput
    _min?: PagoMinOrderByAggregateInput
    _sum?: PagoSumOrderByAggregateInput
  }

  export type PagoScalarWhereWithAggregatesInput = {
    AND?: PagoScalarWhereWithAggregatesInput | PagoScalarWhereWithAggregatesInput[]
    OR?: PagoScalarWhereWithAggregatesInput[]
    NOT?: PagoScalarWhereWithAggregatesInput | PagoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pago"> | string
    reservaId?: StringWithAggregatesFilter<"Pago"> | string
    proveedor?: StringWithAggregatesFilter<"Pago"> | string
    referenciaExterna?: StringNullableWithAggregatesFilter<"Pago"> | string | null
    monto?: DecimalWithAggregatesFilter<"Pago"> | Decimal | DecimalJsLike | number | string
    moneda?: StringWithAggregatesFilter<"Pago"> | string
    estado?: EnumEstadoPagoWithAggregatesFilter<"Pago"> | $Enums.EstadoPago
    urlPago?: StringNullableWithAggregatesFilter<"Pago"> | string | null
    fechaPago?: DateTimeNullableWithAggregatesFilter<"Pago"> | Date | string | null
    respuestaProveedor?: JsonNullableWithAggregatesFilter<"Pago">
    createdAt?: DateTimeWithAggregatesFilter<"Pago"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Pago"> | Date | string
  }

  export type ImagenHabitacionWhereInput = {
    AND?: ImagenHabitacionWhereInput | ImagenHabitacionWhereInput[]
    OR?: ImagenHabitacionWhereInput[]
    NOT?: ImagenHabitacionWhereInput | ImagenHabitacionWhereInput[]
    id?: StringFilter<"ImagenHabitacion"> | string
    url?: StringFilter<"ImagenHabitacion"> | string
    descripcion?: StringNullableFilter<"ImagenHabitacion"> | string | null
    orden?: IntFilter<"ImagenHabitacion"> | number
    activa?: BoolFilter<"ImagenHabitacion"> | boolean
    createdAt?: DateTimeFilter<"ImagenHabitacion"> | Date | string
  }

  export type ImagenHabitacionOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    orden?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
  }

  export type ImagenHabitacionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImagenHabitacionWhereInput | ImagenHabitacionWhereInput[]
    OR?: ImagenHabitacionWhereInput[]
    NOT?: ImagenHabitacionWhereInput | ImagenHabitacionWhereInput[]
    url?: StringFilter<"ImagenHabitacion"> | string
    descripcion?: StringNullableFilter<"ImagenHabitacion"> | string | null
    orden?: IntFilter<"ImagenHabitacion"> | number
    activa?: BoolFilter<"ImagenHabitacion"> | boolean
    createdAt?: DateTimeFilter<"ImagenHabitacion"> | Date | string
  }, "id">

  export type ImagenHabitacionOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    orden?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    _count?: ImagenHabitacionCountOrderByAggregateInput
    _avg?: ImagenHabitacionAvgOrderByAggregateInput
    _max?: ImagenHabitacionMaxOrderByAggregateInput
    _min?: ImagenHabitacionMinOrderByAggregateInput
    _sum?: ImagenHabitacionSumOrderByAggregateInput
  }

  export type ImagenHabitacionScalarWhereWithAggregatesInput = {
    AND?: ImagenHabitacionScalarWhereWithAggregatesInput | ImagenHabitacionScalarWhereWithAggregatesInput[]
    OR?: ImagenHabitacionScalarWhereWithAggregatesInput[]
    NOT?: ImagenHabitacionScalarWhereWithAggregatesInput | ImagenHabitacionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImagenHabitacion"> | string
    url?: StringWithAggregatesFilter<"ImagenHabitacion"> | string
    descripcion?: StringNullableWithAggregatesFilter<"ImagenHabitacion"> | string | null
    orden?: IntWithAggregatesFilter<"ImagenHabitacion"> | number
    activa?: BoolWithAggregatesFilter<"ImagenHabitacion"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ImagenHabitacion"> | Date | string
  }

  export type ConversationWhereInput = {
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    id?: StringFilter<"Conversation"> | string
    telefono?: StringFilter<"Conversation"> | string
    mode?: EnumConversationModeFilter<"Conversation"> | $Enums.ConversationMode
    step?: EnumBookingStepFilter<"Conversation"> | $Enums.BookingStep
    nombreCliente?: StringNullableFilter<"Conversation"> | string | null
    fechaEntrada?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    fechaSalida?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    cantidadPersonas?: IntNullableFilter<"Conversation"> | number | null
    reservaId?: StringNullableFilter<"Conversation"> | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
    ultimaDisponibilidadAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    messages?: MessageListRelationFilter
  }

  export type ConversationOrderByWithRelationInput = {
    id?: SortOrder
    telefono?: SortOrder
    mode?: SortOrder
    step?: SortOrder
    nombreCliente?: SortOrderInput | SortOrder
    fechaEntrada?: SortOrderInput | SortOrder
    fechaSalida?: SortOrderInput | SortOrder
    cantidadPersonas?: SortOrderInput | SortOrder
    reservaId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ultimaDisponibilidadAt?: SortOrderInput | SortOrder
    messages?: MessageOrderByRelationAggregateInput
  }

  export type ConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    telefono?: string
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    mode?: EnumConversationModeFilter<"Conversation"> | $Enums.ConversationMode
    step?: EnumBookingStepFilter<"Conversation"> | $Enums.BookingStep
    nombreCliente?: StringNullableFilter<"Conversation"> | string | null
    fechaEntrada?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    fechaSalida?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    cantidadPersonas?: IntNullableFilter<"Conversation"> | number | null
    reservaId?: StringNullableFilter<"Conversation"> | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
    ultimaDisponibilidadAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    messages?: MessageListRelationFilter
  }, "id" | "telefono">

  export type ConversationOrderByWithAggregationInput = {
    id?: SortOrder
    telefono?: SortOrder
    mode?: SortOrder
    step?: SortOrder
    nombreCliente?: SortOrderInput | SortOrder
    fechaEntrada?: SortOrderInput | SortOrder
    fechaSalida?: SortOrderInput | SortOrder
    cantidadPersonas?: SortOrderInput | SortOrder
    reservaId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ultimaDisponibilidadAt?: SortOrderInput | SortOrder
    _count?: ConversationCountOrderByAggregateInput
    _avg?: ConversationAvgOrderByAggregateInput
    _max?: ConversationMaxOrderByAggregateInput
    _min?: ConversationMinOrderByAggregateInput
    _sum?: ConversationSumOrderByAggregateInput
  }

  export type ConversationScalarWhereWithAggregatesInput = {
    AND?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    OR?: ConversationScalarWhereWithAggregatesInput[]
    NOT?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Conversation"> | string
    telefono?: StringWithAggregatesFilter<"Conversation"> | string
    mode?: EnumConversationModeWithAggregatesFilter<"Conversation"> | $Enums.ConversationMode
    step?: EnumBookingStepWithAggregatesFilter<"Conversation"> | $Enums.BookingStep
    nombreCliente?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    fechaEntrada?: DateTimeNullableWithAggregatesFilter<"Conversation"> | Date | string | null
    fechaSalida?: DateTimeNullableWithAggregatesFilter<"Conversation"> | Date | string | null
    cantidadPersonas?: IntNullableWithAggregatesFilter<"Conversation"> | number | null
    reservaId?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
    ultimaDisponibilidadAt?: DateTimeNullableWithAggregatesFilter<"Conversation"> | Date | string | null
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    conversationId?: StringFilter<"Message"> | string
    role?: EnumMessageRoleFilter<"Message"> | $Enums.MessageRole
    content?: StringFilter<"Message"> | string
    toolName?: StringNullableFilter<"Message"> | string | null
    toolData?: JsonNullableFilter<"Message">
    createdAt?: DateTimeFilter<"Message"> | Date | string
    conversation?: XOR<ConversationScalarRelationFilter, ConversationWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    toolName?: SortOrderInput | SortOrder
    toolData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    conversation?: ConversationOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    conversationId?: StringFilter<"Message"> | string
    role?: EnumMessageRoleFilter<"Message"> | $Enums.MessageRole
    content?: StringFilter<"Message"> | string
    toolName?: StringNullableFilter<"Message"> | string | null
    toolData?: JsonNullableFilter<"Message">
    createdAt?: DateTimeFilter<"Message"> | Date | string
    conversation?: XOR<ConversationScalarRelationFilter, ConversationWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    toolName?: SortOrderInput | SortOrder
    toolData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    conversationId?: StringWithAggregatesFilter<"Message"> | string
    role?: EnumMessageRoleWithAggregatesFilter<"Message"> | $Enums.MessageRole
    content?: StringWithAggregatesFilter<"Message"> | string
    toolName?: StringNullableWithAggregatesFilter<"Message"> | string | null
    toolData?: JsonNullableWithAggregatesFilter<"Message">
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type HabitacionCreateInput = {
    id?: string
    numero: string
    capacidad: number
    estado?: $Enums.EstadoHabitacion
    activa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    reservas?: ReservaCreateNestedManyWithoutHabitacionInput
  }

  export type HabitacionUncheckedCreateInput = {
    id?: string
    numero: string
    capacidad: number
    estado?: $Enums.EstadoHabitacion
    activa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    reservas?: ReservaUncheckedCreateNestedManyWithoutHabitacionInput
  }

  export type HabitacionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    capacidad?: IntFieldUpdateOperationsInput | number
    estado?: EnumEstadoHabitacionFieldUpdateOperationsInput | $Enums.EstadoHabitacion
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservas?: ReservaUpdateManyWithoutHabitacionNestedInput
  }

  export type HabitacionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    capacidad?: IntFieldUpdateOperationsInput | number
    estado?: EnumEstadoHabitacionFieldUpdateOperationsInput | $Enums.EstadoHabitacion
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservas?: ReservaUncheckedUpdateManyWithoutHabitacionNestedInput
  }

  export type HabitacionCreateManyInput = {
    id?: string
    numero: string
    capacidad: number
    estado?: $Enums.EstadoHabitacion
    activa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HabitacionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    capacidad?: IntFieldUpdateOperationsInput | number
    estado?: EnumEstadoHabitacionFieldUpdateOperationsInput | $Enums.EstadoHabitacion
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HabitacionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    capacidad?: IntFieldUpdateOperationsInput | number
    estado?: EnumEstadoHabitacionFieldUpdateOperationsInput | $Enums.EstadoHabitacion
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteCreateInput = {
    id?: string
    nombre: string
    telefono: string
    correo?: string | null
    documento?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reservas?: ReservaCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateInput = {
    id?: string
    nombre: string
    telefono: string
    correo?: string | null
    documento?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reservas?: ReservaUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservas?: ReservaUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reservas?: ReservaUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type ClienteCreateManyInput = {
    id?: string
    nombre: string
    telefono: string
    correo?: string | null
    documento?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClienteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TarifaCreateInput = {
    id?: string
    personas: number
    precio: Decimal | DecimalJsLike | number | string
    activa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TarifaUncheckedCreateInput = {
    id?: string
    personas: number
    precio: Decimal | DecimalJsLike | number | string
    activa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TarifaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    personas?: IntFieldUpdateOperationsInput | number
    precio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TarifaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    personas?: IntFieldUpdateOperationsInput | number
    precio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TarifaCreateManyInput = {
    id?: string
    personas: number
    precio: Decimal | DecimalJsLike | number | string
    activa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TarifaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    personas?: IntFieldUpdateOperationsInput | number
    precio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TarifaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    personas?: IntFieldUpdateOperationsInput | number
    precio?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservaCreateInput = {
    id?: string
    codigo: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cliente: ClienteCreateNestedOneWithoutReservasInput
    habitacion: HabitacionCreateNestedOneWithoutReservasInput
    pago?: PagoCreateNestedOneWithoutReservaInput
  }

  export type ReservaUncheckedCreateInput = {
    id?: string
    codigo: string
    clienteId: string
    habitacionId: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pago?: PagoUncheckedCreateNestedOneWithoutReservaInput
  }

  export type ReservaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutReservasNestedInput
    habitacion?: HabitacionUpdateOneRequiredWithoutReservasNestedInput
    pago?: PagoUpdateOneWithoutReservaNestedInput
  }

  export type ReservaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    habitacionId?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pago?: PagoUncheckedUpdateOneWithoutReservaNestedInput
  }

  export type ReservaCreateManyInput = {
    id?: string
    codigo: string
    clienteId: string
    habitacionId: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    habitacionId?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagoCreateInput = {
    id?: string
    proveedor?: string
    referenciaExterna?: string | null
    monto: Decimal | DecimalJsLike | number | string
    moneda?: string
    estado?: $Enums.EstadoPago
    urlPago?: string | null
    fechaPago?: Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    reserva: ReservaCreateNestedOneWithoutPagoInput
  }

  export type PagoUncheckedCreateInput = {
    id?: string
    reservaId: string
    proveedor?: string
    referenciaExterna?: string | null
    monto: Decimal | DecimalJsLike | number | string
    moneda?: string
    estado?: $Enums.EstadoPago
    urlPago?: string | null
    fechaPago?: Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PagoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    proveedor?: StringFieldUpdateOperationsInput | string
    referenciaExterna?: NullableStringFieldUpdateOperationsInput | string | null
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    moneda?: StringFieldUpdateOperationsInput | string
    estado?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    urlPago?: NullableStringFieldUpdateOperationsInput | string | null
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reserva?: ReservaUpdateOneRequiredWithoutPagoNestedInput
  }

  export type PagoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservaId?: StringFieldUpdateOperationsInput | string
    proveedor?: StringFieldUpdateOperationsInput | string
    referenciaExterna?: NullableStringFieldUpdateOperationsInput | string | null
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    moneda?: StringFieldUpdateOperationsInput | string
    estado?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    urlPago?: NullableStringFieldUpdateOperationsInput | string | null
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagoCreateManyInput = {
    id?: string
    reservaId: string
    proveedor?: string
    referenciaExterna?: string | null
    monto: Decimal | DecimalJsLike | number | string
    moneda?: string
    estado?: $Enums.EstadoPago
    urlPago?: string | null
    fechaPago?: Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PagoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    proveedor?: StringFieldUpdateOperationsInput | string
    referenciaExterna?: NullableStringFieldUpdateOperationsInput | string | null
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    moneda?: StringFieldUpdateOperationsInput | string
    estado?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    urlPago?: NullableStringFieldUpdateOperationsInput | string | null
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reservaId?: StringFieldUpdateOperationsInput | string
    proveedor?: StringFieldUpdateOperationsInput | string
    referenciaExterna?: NullableStringFieldUpdateOperationsInput | string | null
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    moneda?: StringFieldUpdateOperationsInput | string
    estado?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    urlPago?: NullableStringFieldUpdateOperationsInput | string | null
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagenHabitacionCreateInput = {
    id?: string
    url: string
    descripcion?: string | null
    orden?: number
    activa?: boolean
    createdAt?: Date | string
  }

  export type ImagenHabitacionUncheckedCreateInput = {
    id?: string
    url: string
    descripcion?: string | null
    orden?: number
    activa?: boolean
    createdAt?: Date | string
  }

  export type ImagenHabitacionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    orden?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagenHabitacionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    orden?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagenHabitacionCreateManyInput = {
    id?: string
    url: string
    descripcion?: string | null
    orden?: number
    activa?: boolean
    createdAt?: Date | string
  }

  export type ImagenHabitacionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    orden?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagenHabitacionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    orden?: IntFieldUpdateOperationsInput | number
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationCreateInput = {
    id?: string
    telefono: string
    mode?: $Enums.ConversationMode
    step?: $Enums.BookingStep
    nombreCliente?: string | null
    fechaEntrada?: Date | string | null
    fechaSalida?: Date | string | null
    cantidadPersonas?: number | null
    reservaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ultimaDisponibilidadAt?: Date | string | null
    messages?: MessageCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateInput = {
    id?: string
    telefono: string
    mode?: $Enums.ConversationMode
    step?: $Enums.BookingStep
    nombreCliente?: string | null
    fechaEntrada?: Date | string | null
    fechaSalida?: Date | string | null
    cantidadPersonas?: number | null
    reservaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ultimaDisponibilidadAt?: Date | string | null
    messages?: MessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    mode?: EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode
    step?: EnumBookingStepFieldUpdateOperationsInput | $Enums.BookingStep
    nombreCliente?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEntrada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSalida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cantidadPersonas?: NullableIntFieldUpdateOperationsInput | number | null
    reservaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ultimaDisponibilidadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: MessageUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    mode?: EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode
    step?: EnumBookingStepFieldUpdateOperationsInput | $Enums.BookingStep
    nombreCliente?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEntrada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSalida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cantidadPersonas?: NullableIntFieldUpdateOperationsInput | number | null
    reservaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ultimaDisponibilidadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: MessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationCreateManyInput = {
    id?: string
    telefono: string
    mode?: $Enums.ConversationMode
    step?: $Enums.BookingStep
    nombreCliente?: string | null
    fechaEntrada?: Date | string | null
    fechaSalida?: Date | string | null
    cantidadPersonas?: number | null
    reservaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ultimaDisponibilidadAt?: Date | string | null
  }

  export type ConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    mode?: EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode
    step?: EnumBookingStepFieldUpdateOperationsInput | $Enums.BookingStep
    nombreCliente?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEntrada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSalida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cantidadPersonas?: NullableIntFieldUpdateOperationsInput | number | null
    reservaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ultimaDisponibilidadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    mode?: EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode
    step?: EnumBookingStepFieldUpdateOperationsInput | $Enums.BookingStep
    nombreCliente?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEntrada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSalida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cantidadPersonas?: NullableIntFieldUpdateOperationsInput | number | null
    reservaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ultimaDisponibilidadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageCreateInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    toolName?: string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    conversation: ConversationCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    conversationId: string
    role: $Enums.MessageRole
    content: string
    toolName?: string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: ConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: string
    conversationId: string
    role: $Enums.MessageRole
    content: string
    toolName?: string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumEstadoHabitacionFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoHabitacion | EnumEstadoHabitacionFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoHabitacion[] | ListEnumEstadoHabitacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoHabitacion[] | ListEnumEstadoHabitacionFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoHabitacionFilter<$PrismaModel> | $Enums.EstadoHabitacion
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ReservaListRelationFilter = {
    every?: ReservaWhereInput
    some?: ReservaWhereInput
    none?: ReservaWhereInput
  }

  export type ReservaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HabitacionCountOrderByAggregateInput = {
    id?: SortOrder
    numero?: SortOrder
    capacidad?: SortOrder
    estado?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HabitacionAvgOrderByAggregateInput = {
    capacidad?: SortOrder
  }

  export type HabitacionMaxOrderByAggregateInput = {
    id?: SortOrder
    numero?: SortOrder
    capacidad?: SortOrder
    estado?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HabitacionMinOrderByAggregateInput = {
    id?: SortOrder
    numero?: SortOrder
    capacidad?: SortOrder
    estado?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HabitacionSumOrderByAggregateInput = {
    capacidad?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumEstadoHabitacionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoHabitacion | EnumEstadoHabitacionFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoHabitacion[] | ListEnumEstadoHabitacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoHabitacion[] | ListEnumEstadoHabitacionFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoHabitacionWithAggregatesFilter<$PrismaModel> | $Enums.EstadoHabitacion
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoHabitacionFilter<$PrismaModel>
    _max?: NestedEnumEstadoHabitacionFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ClienteCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    telefono?: SortOrder
    correo?: SortOrder
    documento?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    telefono?: SortOrder
    correo?: SortOrder
    documento?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClienteMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    telefono?: SortOrder
    correo?: SortOrder
    documento?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type TarifaCountOrderByAggregateInput = {
    id?: SortOrder
    personas?: SortOrder
    precio?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TarifaAvgOrderByAggregateInput = {
    personas?: SortOrder
    precio?: SortOrder
  }

  export type TarifaMaxOrderByAggregateInput = {
    id?: SortOrder
    personas?: SortOrder
    precio?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TarifaMinOrderByAggregateInput = {
    id?: SortOrder
    personas?: SortOrder
    precio?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TarifaSumOrderByAggregateInput = {
    personas?: SortOrder
    precio?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumEstadoReservaFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoReserva | EnumEstadoReservaFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoReserva[] | ListEnumEstadoReservaFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoReserva[] | ListEnumEstadoReservaFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoReservaFilter<$PrismaModel> | $Enums.EstadoReserva
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ClienteScalarRelationFilter = {
    is?: ClienteWhereInput
    isNot?: ClienteWhereInput
  }

  export type HabitacionScalarRelationFilter = {
    is?: HabitacionWhereInput
    isNot?: HabitacionWhereInput
  }

  export type PagoNullableScalarRelationFilter = {
    is?: PagoWhereInput | null
    isNot?: PagoWhereInput | null
  }

  export type ReservaCountOrderByAggregateInput = {
    id?: SortOrder
    codigo?: SortOrder
    clienteId?: SortOrder
    habitacionId?: SortOrder
    fechaEntrada?: SortOrder
    fechaSalida?: SortOrder
    cantidadPersonas?: SortOrder
    cantidadNoches?: SortOrder
    precioPorNoche?: SortOrder
    precioTotal?: SortOrder
    estado?: SortOrder
    expiraEn?: SortOrder
    observaciones?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReservaAvgOrderByAggregateInput = {
    cantidadPersonas?: SortOrder
    cantidadNoches?: SortOrder
    precioPorNoche?: SortOrder
    precioTotal?: SortOrder
  }

  export type ReservaMaxOrderByAggregateInput = {
    id?: SortOrder
    codigo?: SortOrder
    clienteId?: SortOrder
    habitacionId?: SortOrder
    fechaEntrada?: SortOrder
    fechaSalida?: SortOrder
    cantidadPersonas?: SortOrder
    cantidadNoches?: SortOrder
    precioPorNoche?: SortOrder
    precioTotal?: SortOrder
    estado?: SortOrder
    expiraEn?: SortOrder
    observaciones?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReservaMinOrderByAggregateInput = {
    id?: SortOrder
    codigo?: SortOrder
    clienteId?: SortOrder
    habitacionId?: SortOrder
    fechaEntrada?: SortOrder
    fechaSalida?: SortOrder
    cantidadPersonas?: SortOrder
    cantidadNoches?: SortOrder
    precioPorNoche?: SortOrder
    precioTotal?: SortOrder
    estado?: SortOrder
    expiraEn?: SortOrder
    observaciones?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReservaSumOrderByAggregateInput = {
    cantidadPersonas?: SortOrder
    cantidadNoches?: SortOrder
    precioPorNoche?: SortOrder
    precioTotal?: SortOrder
  }

  export type EnumEstadoReservaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoReserva | EnumEstadoReservaFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoReserva[] | ListEnumEstadoReservaFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoReserva[] | ListEnumEstadoReservaFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoReservaWithAggregatesFilter<$PrismaModel> | $Enums.EstadoReserva
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoReservaFilter<$PrismaModel>
    _max?: NestedEnumEstadoReservaFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumEstadoPagoFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoPago | EnumEstadoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoPagoFilter<$PrismaModel> | $Enums.EstadoPago
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ReservaScalarRelationFilter = {
    is?: ReservaWhereInput
    isNot?: ReservaWhereInput
  }

  export type PagoCountOrderByAggregateInput = {
    id?: SortOrder
    reservaId?: SortOrder
    proveedor?: SortOrder
    referenciaExterna?: SortOrder
    monto?: SortOrder
    moneda?: SortOrder
    estado?: SortOrder
    urlPago?: SortOrder
    fechaPago?: SortOrder
    respuestaProveedor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PagoAvgOrderByAggregateInput = {
    monto?: SortOrder
  }

  export type PagoMaxOrderByAggregateInput = {
    id?: SortOrder
    reservaId?: SortOrder
    proveedor?: SortOrder
    referenciaExterna?: SortOrder
    monto?: SortOrder
    moneda?: SortOrder
    estado?: SortOrder
    urlPago?: SortOrder
    fechaPago?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PagoMinOrderByAggregateInput = {
    id?: SortOrder
    reservaId?: SortOrder
    proveedor?: SortOrder
    referenciaExterna?: SortOrder
    monto?: SortOrder
    moneda?: SortOrder
    estado?: SortOrder
    urlPago?: SortOrder
    fechaPago?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PagoSumOrderByAggregateInput = {
    monto?: SortOrder
  }

  export type EnumEstadoPagoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoPago | EnumEstadoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoPagoWithAggregatesFilter<$PrismaModel> | $Enums.EstadoPago
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoPagoFilter<$PrismaModel>
    _max?: NestedEnumEstadoPagoFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ImagenHabitacionCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    descripcion?: SortOrder
    orden?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
  }

  export type ImagenHabitacionAvgOrderByAggregateInput = {
    orden?: SortOrder
  }

  export type ImagenHabitacionMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    descripcion?: SortOrder
    orden?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
  }

  export type ImagenHabitacionMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    descripcion?: SortOrder
    orden?: SortOrder
    activa?: SortOrder
    createdAt?: SortOrder
  }

  export type ImagenHabitacionSumOrderByAggregateInput = {
    orden?: SortOrder
  }

  export type EnumConversationModeFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationMode | EnumConversationModeFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationMode[] | ListEnumConversationModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationMode[] | ListEnumConversationModeFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationModeFilter<$PrismaModel> | $Enums.ConversationMode
  }

  export type EnumBookingStepFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStep | EnumBookingStepFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStep[] | ListEnumBookingStepFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStep[] | ListEnumBookingStepFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStepFilter<$PrismaModel> | $Enums.BookingStep
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationCountOrderByAggregateInput = {
    id?: SortOrder
    telefono?: SortOrder
    mode?: SortOrder
    step?: SortOrder
    nombreCliente?: SortOrder
    fechaEntrada?: SortOrder
    fechaSalida?: SortOrder
    cantidadPersonas?: SortOrder
    reservaId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ultimaDisponibilidadAt?: SortOrder
  }

  export type ConversationAvgOrderByAggregateInput = {
    cantidadPersonas?: SortOrder
  }

  export type ConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    telefono?: SortOrder
    mode?: SortOrder
    step?: SortOrder
    nombreCliente?: SortOrder
    fechaEntrada?: SortOrder
    fechaSalida?: SortOrder
    cantidadPersonas?: SortOrder
    reservaId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ultimaDisponibilidadAt?: SortOrder
  }

  export type ConversationMinOrderByAggregateInput = {
    id?: SortOrder
    telefono?: SortOrder
    mode?: SortOrder
    step?: SortOrder
    nombreCliente?: SortOrder
    fechaEntrada?: SortOrder
    fechaSalida?: SortOrder
    cantidadPersonas?: SortOrder
    reservaId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ultimaDisponibilidadAt?: SortOrder
  }

  export type ConversationSumOrderByAggregateInput = {
    cantidadPersonas?: SortOrder
  }

  export type EnumConversationModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationMode | EnumConversationModeFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationMode[] | ListEnumConversationModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationMode[] | ListEnumConversationModeFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationModeWithAggregatesFilter<$PrismaModel> | $Enums.ConversationMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationModeFilter<$PrismaModel>
    _max?: NestedEnumConversationModeFilter<$PrismaModel>
  }

  export type EnumBookingStepWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStep | EnumBookingStepFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStep[] | ListEnumBookingStepFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStep[] | ListEnumBookingStepFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStepWithAggregatesFilter<$PrismaModel> | $Enums.BookingStep
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingStepFilter<$PrismaModel>
    _max?: NestedEnumBookingStepFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole
  }

  export type ConversationScalarRelationFilter = {
    is?: ConversationWhereInput
    isNot?: ConversationWhereInput
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    toolName?: SortOrder
    toolData?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    toolName?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    toolName?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.MessageRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageRoleFilter<$PrismaModel>
    _max?: NestedEnumMessageRoleFilter<$PrismaModel>
  }

  export type ReservaCreateNestedManyWithoutHabitacionInput = {
    create?: XOR<ReservaCreateWithoutHabitacionInput, ReservaUncheckedCreateWithoutHabitacionInput> | ReservaCreateWithoutHabitacionInput[] | ReservaUncheckedCreateWithoutHabitacionInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutHabitacionInput | ReservaCreateOrConnectWithoutHabitacionInput[]
    createMany?: ReservaCreateManyHabitacionInputEnvelope
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
  }

  export type ReservaUncheckedCreateNestedManyWithoutHabitacionInput = {
    create?: XOR<ReservaCreateWithoutHabitacionInput, ReservaUncheckedCreateWithoutHabitacionInput> | ReservaCreateWithoutHabitacionInput[] | ReservaUncheckedCreateWithoutHabitacionInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutHabitacionInput | ReservaCreateOrConnectWithoutHabitacionInput[]
    createMany?: ReservaCreateManyHabitacionInputEnvelope
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumEstadoHabitacionFieldUpdateOperationsInput = {
    set?: $Enums.EstadoHabitacion
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ReservaUpdateManyWithoutHabitacionNestedInput = {
    create?: XOR<ReservaCreateWithoutHabitacionInput, ReservaUncheckedCreateWithoutHabitacionInput> | ReservaCreateWithoutHabitacionInput[] | ReservaUncheckedCreateWithoutHabitacionInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutHabitacionInput | ReservaCreateOrConnectWithoutHabitacionInput[]
    upsert?: ReservaUpsertWithWhereUniqueWithoutHabitacionInput | ReservaUpsertWithWhereUniqueWithoutHabitacionInput[]
    createMany?: ReservaCreateManyHabitacionInputEnvelope
    set?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    disconnect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    delete?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    update?: ReservaUpdateWithWhereUniqueWithoutHabitacionInput | ReservaUpdateWithWhereUniqueWithoutHabitacionInput[]
    updateMany?: ReservaUpdateManyWithWhereWithoutHabitacionInput | ReservaUpdateManyWithWhereWithoutHabitacionInput[]
    deleteMany?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
  }

  export type ReservaUncheckedUpdateManyWithoutHabitacionNestedInput = {
    create?: XOR<ReservaCreateWithoutHabitacionInput, ReservaUncheckedCreateWithoutHabitacionInput> | ReservaCreateWithoutHabitacionInput[] | ReservaUncheckedCreateWithoutHabitacionInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutHabitacionInput | ReservaCreateOrConnectWithoutHabitacionInput[]
    upsert?: ReservaUpsertWithWhereUniqueWithoutHabitacionInput | ReservaUpsertWithWhereUniqueWithoutHabitacionInput[]
    createMany?: ReservaCreateManyHabitacionInputEnvelope
    set?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    disconnect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    delete?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    update?: ReservaUpdateWithWhereUniqueWithoutHabitacionInput | ReservaUpdateWithWhereUniqueWithoutHabitacionInput[]
    updateMany?: ReservaUpdateManyWithWhereWithoutHabitacionInput | ReservaUpdateManyWithWhereWithoutHabitacionInput[]
    deleteMany?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
  }

  export type ReservaCreateNestedManyWithoutClienteInput = {
    create?: XOR<ReservaCreateWithoutClienteInput, ReservaUncheckedCreateWithoutClienteInput> | ReservaCreateWithoutClienteInput[] | ReservaUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutClienteInput | ReservaCreateOrConnectWithoutClienteInput[]
    createMany?: ReservaCreateManyClienteInputEnvelope
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
  }

  export type ReservaUncheckedCreateNestedManyWithoutClienteInput = {
    create?: XOR<ReservaCreateWithoutClienteInput, ReservaUncheckedCreateWithoutClienteInput> | ReservaCreateWithoutClienteInput[] | ReservaUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutClienteInput | ReservaCreateOrConnectWithoutClienteInput[]
    createMany?: ReservaCreateManyClienteInputEnvelope
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ReservaUpdateManyWithoutClienteNestedInput = {
    create?: XOR<ReservaCreateWithoutClienteInput, ReservaUncheckedCreateWithoutClienteInput> | ReservaCreateWithoutClienteInput[] | ReservaUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutClienteInput | ReservaCreateOrConnectWithoutClienteInput[]
    upsert?: ReservaUpsertWithWhereUniqueWithoutClienteInput | ReservaUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: ReservaCreateManyClienteInputEnvelope
    set?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    disconnect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    delete?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    update?: ReservaUpdateWithWhereUniqueWithoutClienteInput | ReservaUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: ReservaUpdateManyWithWhereWithoutClienteInput | ReservaUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
  }

  export type ReservaUncheckedUpdateManyWithoutClienteNestedInput = {
    create?: XOR<ReservaCreateWithoutClienteInput, ReservaUncheckedCreateWithoutClienteInput> | ReservaCreateWithoutClienteInput[] | ReservaUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutClienteInput | ReservaCreateOrConnectWithoutClienteInput[]
    upsert?: ReservaUpsertWithWhereUniqueWithoutClienteInput | ReservaUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: ReservaCreateManyClienteInputEnvelope
    set?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    disconnect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    delete?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    update?: ReservaUpdateWithWhereUniqueWithoutClienteInput | ReservaUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: ReservaUpdateManyWithWhereWithoutClienteInput | ReservaUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type ClienteCreateNestedOneWithoutReservasInput = {
    create?: XOR<ClienteCreateWithoutReservasInput, ClienteUncheckedCreateWithoutReservasInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutReservasInput
    connect?: ClienteWhereUniqueInput
  }

  export type HabitacionCreateNestedOneWithoutReservasInput = {
    create?: XOR<HabitacionCreateWithoutReservasInput, HabitacionUncheckedCreateWithoutReservasInput>
    connectOrCreate?: HabitacionCreateOrConnectWithoutReservasInput
    connect?: HabitacionWhereUniqueInput
  }

  export type PagoCreateNestedOneWithoutReservaInput = {
    create?: XOR<PagoCreateWithoutReservaInput, PagoUncheckedCreateWithoutReservaInput>
    connectOrCreate?: PagoCreateOrConnectWithoutReservaInput
    connect?: PagoWhereUniqueInput
  }

  export type PagoUncheckedCreateNestedOneWithoutReservaInput = {
    create?: XOR<PagoCreateWithoutReservaInput, PagoUncheckedCreateWithoutReservaInput>
    connectOrCreate?: PagoCreateOrConnectWithoutReservaInput
    connect?: PagoWhereUniqueInput
  }

  export type EnumEstadoReservaFieldUpdateOperationsInput = {
    set?: $Enums.EstadoReserva
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ClienteUpdateOneRequiredWithoutReservasNestedInput = {
    create?: XOR<ClienteCreateWithoutReservasInput, ClienteUncheckedCreateWithoutReservasInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutReservasInput
    upsert?: ClienteUpsertWithoutReservasInput
    connect?: ClienteWhereUniqueInput
    update?: XOR<XOR<ClienteUpdateToOneWithWhereWithoutReservasInput, ClienteUpdateWithoutReservasInput>, ClienteUncheckedUpdateWithoutReservasInput>
  }

  export type HabitacionUpdateOneRequiredWithoutReservasNestedInput = {
    create?: XOR<HabitacionCreateWithoutReservasInput, HabitacionUncheckedCreateWithoutReservasInput>
    connectOrCreate?: HabitacionCreateOrConnectWithoutReservasInput
    upsert?: HabitacionUpsertWithoutReservasInput
    connect?: HabitacionWhereUniqueInput
    update?: XOR<XOR<HabitacionUpdateToOneWithWhereWithoutReservasInput, HabitacionUpdateWithoutReservasInput>, HabitacionUncheckedUpdateWithoutReservasInput>
  }

  export type PagoUpdateOneWithoutReservaNestedInput = {
    create?: XOR<PagoCreateWithoutReservaInput, PagoUncheckedCreateWithoutReservaInput>
    connectOrCreate?: PagoCreateOrConnectWithoutReservaInput
    upsert?: PagoUpsertWithoutReservaInput
    disconnect?: PagoWhereInput | boolean
    delete?: PagoWhereInput | boolean
    connect?: PagoWhereUniqueInput
    update?: XOR<XOR<PagoUpdateToOneWithWhereWithoutReservaInput, PagoUpdateWithoutReservaInput>, PagoUncheckedUpdateWithoutReservaInput>
  }

  export type PagoUncheckedUpdateOneWithoutReservaNestedInput = {
    create?: XOR<PagoCreateWithoutReservaInput, PagoUncheckedCreateWithoutReservaInput>
    connectOrCreate?: PagoCreateOrConnectWithoutReservaInput
    upsert?: PagoUpsertWithoutReservaInput
    disconnect?: PagoWhereInput | boolean
    delete?: PagoWhereInput | boolean
    connect?: PagoWhereUniqueInput
    update?: XOR<XOR<PagoUpdateToOneWithWhereWithoutReservaInput, PagoUpdateWithoutReservaInput>, PagoUncheckedUpdateWithoutReservaInput>
  }

  export type ReservaCreateNestedOneWithoutPagoInput = {
    create?: XOR<ReservaCreateWithoutPagoInput, ReservaUncheckedCreateWithoutPagoInput>
    connectOrCreate?: ReservaCreateOrConnectWithoutPagoInput
    connect?: ReservaWhereUniqueInput
  }

  export type EnumEstadoPagoFieldUpdateOperationsInput = {
    set?: $Enums.EstadoPago
  }

  export type ReservaUpdateOneRequiredWithoutPagoNestedInput = {
    create?: XOR<ReservaCreateWithoutPagoInput, ReservaUncheckedCreateWithoutPagoInput>
    connectOrCreate?: ReservaCreateOrConnectWithoutPagoInput
    upsert?: ReservaUpsertWithoutPagoInput
    connect?: ReservaWhereUniqueInput
    update?: XOR<XOR<ReservaUpdateToOneWithWhereWithoutPagoInput, ReservaUpdateWithoutPagoInput>, ReservaUncheckedUpdateWithoutPagoInput>
  }

  export type MessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type EnumConversationModeFieldUpdateOperationsInput = {
    set?: $Enums.ConversationMode
  }

  export type EnumBookingStepFieldUpdateOperationsInput = {
    set?: $Enums.BookingStep
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutConversationInput | MessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutConversationInput | MessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutConversationInput | MessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutConversationInput | MessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutConversationInput | MessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutConversationInput | MessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutMessagesInput
    connect?: ConversationWhereUniqueInput
  }

  export type EnumMessageRoleFieldUpdateOperationsInput = {
    set?: $Enums.MessageRole
  }

  export type ConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutMessagesInput
    upsert?: ConversationUpsertWithoutMessagesInput
    connect?: ConversationWhereUniqueInput
    update?: XOR<XOR<ConversationUpdateToOneWithWhereWithoutMessagesInput, ConversationUpdateWithoutMessagesInput>, ConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumEstadoHabitacionFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoHabitacion | EnumEstadoHabitacionFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoHabitacion[] | ListEnumEstadoHabitacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoHabitacion[] | ListEnumEstadoHabitacionFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoHabitacionFilter<$PrismaModel> | $Enums.EstadoHabitacion
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumEstadoHabitacionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoHabitacion | EnumEstadoHabitacionFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoHabitacion[] | ListEnumEstadoHabitacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoHabitacion[] | ListEnumEstadoHabitacionFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoHabitacionWithAggregatesFilter<$PrismaModel> | $Enums.EstadoHabitacion
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoHabitacionFilter<$PrismaModel>
    _max?: NestedEnumEstadoHabitacionFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumEstadoReservaFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoReserva | EnumEstadoReservaFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoReserva[] | ListEnumEstadoReservaFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoReserva[] | ListEnumEstadoReservaFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoReservaFilter<$PrismaModel> | $Enums.EstadoReserva
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumEstadoReservaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoReserva | EnumEstadoReservaFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoReserva[] | ListEnumEstadoReservaFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoReserva[] | ListEnumEstadoReservaFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoReservaWithAggregatesFilter<$PrismaModel> | $Enums.EstadoReserva
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoReservaFilter<$PrismaModel>
    _max?: NestedEnumEstadoReservaFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumEstadoPagoFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoPago | EnumEstadoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoPagoFilter<$PrismaModel> | $Enums.EstadoPago
  }

  export type NestedEnumEstadoPagoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoPago | EnumEstadoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoPagoWithAggregatesFilter<$PrismaModel> | $Enums.EstadoPago
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoPagoFilter<$PrismaModel>
    _max?: NestedEnumEstadoPagoFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumConversationModeFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationMode | EnumConversationModeFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationMode[] | ListEnumConversationModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationMode[] | ListEnumConversationModeFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationModeFilter<$PrismaModel> | $Enums.ConversationMode
  }

  export type NestedEnumBookingStepFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStep | EnumBookingStepFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStep[] | ListEnumBookingStepFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStep[] | ListEnumBookingStepFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStepFilter<$PrismaModel> | $Enums.BookingStep
  }

  export type NestedEnumConversationModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationMode | EnumConversationModeFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationMode[] | ListEnumConversationModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationMode[] | ListEnumConversationModeFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationModeWithAggregatesFilter<$PrismaModel> | $Enums.ConversationMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationModeFilter<$PrismaModel>
    _max?: NestedEnumConversationModeFilter<$PrismaModel>
  }

  export type NestedEnumBookingStepWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStep | EnumBookingStepFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStep[] | ListEnumBookingStepFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStep[] | ListEnumBookingStepFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStepWithAggregatesFilter<$PrismaModel> | $Enums.BookingStep
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingStepFilter<$PrismaModel>
    _max?: NestedEnumBookingStepFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole
  }

  export type NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.MessageRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageRoleFilter<$PrismaModel>
    _max?: NestedEnumMessageRoleFilter<$PrismaModel>
  }

  export type ReservaCreateWithoutHabitacionInput = {
    id?: string
    codigo: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cliente: ClienteCreateNestedOneWithoutReservasInput
    pago?: PagoCreateNestedOneWithoutReservaInput
  }

  export type ReservaUncheckedCreateWithoutHabitacionInput = {
    id?: string
    codigo: string
    clienteId: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pago?: PagoUncheckedCreateNestedOneWithoutReservaInput
  }

  export type ReservaCreateOrConnectWithoutHabitacionInput = {
    where: ReservaWhereUniqueInput
    create: XOR<ReservaCreateWithoutHabitacionInput, ReservaUncheckedCreateWithoutHabitacionInput>
  }

  export type ReservaCreateManyHabitacionInputEnvelope = {
    data: ReservaCreateManyHabitacionInput | ReservaCreateManyHabitacionInput[]
    skipDuplicates?: boolean
  }

  export type ReservaUpsertWithWhereUniqueWithoutHabitacionInput = {
    where: ReservaWhereUniqueInput
    update: XOR<ReservaUpdateWithoutHabitacionInput, ReservaUncheckedUpdateWithoutHabitacionInput>
    create: XOR<ReservaCreateWithoutHabitacionInput, ReservaUncheckedCreateWithoutHabitacionInput>
  }

  export type ReservaUpdateWithWhereUniqueWithoutHabitacionInput = {
    where: ReservaWhereUniqueInput
    data: XOR<ReservaUpdateWithoutHabitacionInput, ReservaUncheckedUpdateWithoutHabitacionInput>
  }

  export type ReservaUpdateManyWithWhereWithoutHabitacionInput = {
    where: ReservaScalarWhereInput
    data: XOR<ReservaUpdateManyMutationInput, ReservaUncheckedUpdateManyWithoutHabitacionInput>
  }

  export type ReservaScalarWhereInput = {
    AND?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
    OR?: ReservaScalarWhereInput[]
    NOT?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
    id?: StringFilter<"Reserva"> | string
    codigo?: StringFilter<"Reserva"> | string
    clienteId?: StringFilter<"Reserva"> | string
    habitacionId?: StringFilter<"Reserva"> | string
    fechaEntrada?: DateTimeFilter<"Reserva"> | Date | string
    fechaSalida?: DateTimeFilter<"Reserva"> | Date | string
    cantidadPersonas?: IntFilter<"Reserva"> | number
    cantidadNoches?: IntFilter<"Reserva"> | number
    precioPorNoche?: DecimalFilter<"Reserva"> | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFilter<"Reserva"> | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFilter<"Reserva"> | $Enums.EstadoReserva
    expiraEn?: DateTimeNullableFilter<"Reserva"> | Date | string | null
    observaciones?: StringNullableFilter<"Reserva"> | string | null
    createdAt?: DateTimeFilter<"Reserva"> | Date | string
    updatedAt?: DateTimeFilter<"Reserva"> | Date | string
  }

  export type ReservaCreateWithoutClienteInput = {
    id?: string
    codigo: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    habitacion: HabitacionCreateNestedOneWithoutReservasInput
    pago?: PagoCreateNestedOneWithoutReservaInput
  }

  export type ReservaUncheckedCreateWithoutClienteInput = {
    id?: string
    codigo: string
    habitacionId: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pago?: PagoUncheckedCreateNestedOneWithoutReservaInput
  }

  export type ReservaCreateOrConnectWithoutClienteInput = {
    where: ReservaWhereUniqueInput
    create: XOR<ReservaCreateWithoutClienteInput, ReservaUncheckedCreateWithoutClienteInput>
  }

  export type ReservaCreateManyClienteInputEnvelope = {
    data: ReservaCreateManyClienteInput | ReservaCreateManyClienteInput[]
    skipDuplicates?: boolean
  }

  export type ReservaUpsertWithWhereUniqueWithoutClienteInput = {
    where: ReservaWhereUniqueInput
    update: XOR<ReservaUpdateWithoutClienteInput, ReservaUncheckedUpdateWithoutClienteInput>
    create: XOR<ReservaCreateWithoutClienteInput, ReservaUncheckedCreateWithoutClienteInput>
  }

  export type ReservaUpdateWithWhereUniqueWithoutClienteInput = {
    where: ReservaWhereUniqueInput
    data: XOR<ReservaUpdateWithoutClienteInput, ReservaUncheckedUpdateWithoutClienteInput>
  }

  export type ReservaUpdateManyWithWhereWithoutClienteInput = {
    where: ReservaScalarWhereInput
    data: XOR<ReservaUpdateManyMutationInput, ReservaUncheckedUpdateManyWithoutClienteInput>
  }

  export type ClienteCreateWithoutReservasInput = {
    id?: string
    nombre: string
    telefono: string
    correo?: string | null
    documento?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClienteUncheckedCreateWithoutReservasInput = {
    id?: string
    nombre: string
    telefono: string
    correo?: string | null
    documento?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClienteCreateOrConnectWithoutReservasInput = {
    where: ClienteWhereUniqueInput
    create: XOR<ClienteCreateWithoutReservasInput, ClienteUncheckedCreateWithoutReservasInput>
  }

  export type HabitacionCreateWithoutReservasInput = {
    id?: string
    numero: string
    capacidad: number
    estado?: $Enums.EstadoHabitacion
    activa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HabitacionUncheckedCreateWithoutReservasInput = {
    id?: string
    numero: string
    capacidad: number
    estado?: $Enums.EstadoHabitacion
    activa?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HabitacionCreateOrConnectWithoutReservasInput = {
    where: HabitacionWhereUniqueInput
    create: XOR<HabitacionCreateWithoutReservasInput, HabitacionUncheckedCreateWithoutReservasInput>
  }

  export type PagoCreateWithoutReservaInput = {
    id?: string
    proveedor?: string
    referenciaExterna?: string | null
    monto: Decimal | DecimalJsLike | number | string
    moneda?: string
    estado?: $Enums.EstadoPago
    urlPago?: string | null
    fechaPago?: Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PagoUncheckedCreateWithoutReservaInput = {
    id?: string
    proveedor?: string
    referenciaExterna?: string | null
    monto: Decimal | DecimalJsLike | number | string
    moneda?: string
    estado?: $Enums.EstadoPago
    urlPago?: string | null
    fechaPago?: Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PagoCreateOrConnectWithoutReservaInput = {
    where: PagoWhereUniqueInput
    create: XOR<PagoCreateWithoutReservaInput, PagoUncheckedCreateWithoutReservaInput>
  }

  export type ClienteUpsertWithoutReservasInput = {
    update: XOR<ClienteUpdateWithoutReservasInput, ClienteUncheckedUpdateWithoutReservasInput>
    create: XOR<ClienteCreateWithoutReservasInput, ClienteUncheckedCreateWithoutReservasInput>
    where?: ClienteWhereInput
  }

  export type ClienteUpdateToOneWithWhereWithoutReservasInput = {
    where?: ClienteWhereInput
    data: XOR<ClienteUpdateWithoutReservasInput, ClienteUncheckedUpdateWithoutReservasInput>
  }

  export type ClienteUpdateWithoutReservasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteUncheckedUpdateWithoutReservasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    correo?: NullableStringFieldUpdateOperationsInput | string | null
    documento?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HabitacionUpsertWithoutReservasInput = {
    update: XOR<HabitacionUpdateWithoutReservasInput, HabitacionUncheckedUpdateWithoutReservasInput>
    create: XOR<HabitacionCreateWithoutReservasInput, HabitacionUncheckedCreateWithoutReservasInput>
    where?: HabitacionWhereInput
  }

  export type HabitacionUpdateToOneWithWhereWithoutReservasInput = {
    where?: HabitacionWhereInput
    data: XOR<HabitacionUpdateWithoutReservasInput, HabitacionUncheckedUpdateWithoutReservasInput>
  }

  export type HabitacionUpdateWithoutReservasInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    capacidad?: IntFieldUpdateOperationsInput | number
    estado?: EnumEstadoHabitacionFieldUpdateOperationsInput | $Enums.EstadoHabitacion
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HabitacionUncheckedUpdateWithoutReservasInput = {
    id?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    capacidad?: IntFieldUpdateOperationsInput | number
    estado?: EnumEstadoHabitacionFieldUpdateOperationsInput | $Enums.EstadoHabitacion
    activa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagoUpsertWithoutReservaInput = {
    update: XOR<PagoUpdateWithoutReservaInput, PagoUncheckedUpdateWithoutReservaInput>
    create: XOR<PagoCreateWithoutReservaInput, PagoUncheckedCreateWithoutReservaInput>
    where?: PagoWhereInput
  }

  export type PagoUpdateToOneWithWhereWithoutReservaInput = {
    where?: PagoWhereInput
    data: XOR<PagoUpdateWithoutReservaInput, PagoUncheckedUpdateWithoutReservaInput>
  }

  export type PagoUpdateWithoutReservaInput = {
    id?: StringFieldUpdateOperationsInput | string
    proveedor?: StringFieldUpdateOperationsInput | string
    referenciaExterna?: NullableStringFieldUpdateOperationsInput | string | null
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    moneda?: StringFieldUpdateOperationsInput | string
    estado?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    urlPago?: NullableStringFieldUpdateOperationsInput | string | null
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagoUncheckedUpdateWithoutReservaInput = {
    id?: StringFieldUpdateOperationsInput | string
    proveedor?: StringFieldUpdateOperationsInput | string
    referenciaExterna?: NullableStringFieldUpdateOperationsInput | string | null
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    moneda?: StringFieldUpdateOperationsInput | string
    estado?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    urlPago?: NullableStringFieldUpdateOperationsInput | string | null
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respuestaProveedor?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservaCreateWithoutPagoInput = {
    id?: string
    codigo: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cliente: ClienteCreateNestedOneWithoutReservasInput
    habitacion: HabitacionCreateNestedOneWithoutReservasInput
  }

  export type ReservaUncheckedCreateWithoutPagoInput = {
    id?: string
    codigo: string
    clienteId: string
    habitacionId: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservaCreateOrConnectWithoutPagoInput = {
    where: ReservaWhereUniqueInput
    create: XOR<ReservaCreateWithoutPagoInput, ReservaUncheckedCreateWithoutPagoInput>
  }

  export type ReservaUpsertWithoutPagoInput = {
    update: XOR<ReservaUpdateWithoutPagoInput, ReservaUncheckedUpdateWithoutPagoInput>
    create: XOR<ReservaCreateWithoutPagoInput, ReservaUncheckedCreateWithoutPagoInput>
    where?: ReservaWhereInput
  }

  export type ReservaUpdateToOneWithWhereWithoutPagoInput = {
    where?: ReservaWhereInput
    data: XOR<ReservaUpdateWithoutPagoInput, ReservaUncheckedUpdateWithoutPagoInput>
  }

  export type ReservaUpdateWithoutPagoInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutReservasNestedInput
    habitacion?: HabitacionUpdateOneRequiredWithoutReservasNestedInput
  }

  export type ReservaUncheckedUpdateWithoutPagoInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    habitacionId?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateWithoutConversationInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    toolName?: string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MessageUncheckedCreateWithoutConversationInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    toolName?: string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutConversationInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput>
  }

  export type MessageCreateManyConversationInputEnvelope = {
    data: MessageCreateManyConversationInput | MessageCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type MessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutConversationInput, MessageUncheckedUpdateWithoutConversationInput>
    create: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutConversationInput, MessageUncheckedUpdateWithoutConversationInput>
  }

  export type MessageUpdateManyWithWhereWithoutConversationInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    conversationId?: StringFilter<"Message"> | string
    role?: EnumMessageRoleFilter<"Message"> | $Enums.MessageRole
    content?: StringFilter<"Message"> | string
    toolName?: StringNullableFilter<"Message"> | string | null
    toolData?: JsonNullableFilter<"Message">
    createdAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type ConversationCreateWithoutMessagesInput = {
    id?: string
    telefono: string
    mode?: $Enums.ConversationMode
    step?: $Enums.BookingStep
    nombreCliente?: string | null
    fechaEntrada?: Date | string | null
    fechaSalida?: Date | string | null
    cantidadPersonas?: number | null
    reservaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ultimaDisponibilidadAt?: Date | string | null
  }

  export type ConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    telefono: string
    mode?: $Enums.ConversationMode
    step?: $Enums.BookingStep
    nombreCliente?: string | null
    fechaEntrada?: Date | string | null
    fechaSalida?: Date | string | null
    cantidadPersonas?: number | null
    reservaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ultimaDisponibilidadAt?: Date | string | null
  }

  export type ConversationCreateOrConnectWithoutMessagesInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
  }

  export type ConversationUpsertWithoutMessagesInput = {
    update: XOR<ConversationUpdateWithoutMessagesInput, ConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    where?: ConversationWhereInput
  }

  export type ConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ConversationWhereInput
    data: XOR<ConversationUpdateWithoutMessagesInput, ConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type ConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    mode?: EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode
    step?: EnumBookingStepFieldUpdateOperationsInput | $Enums.BookingStep
    nombreCliente?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEntrada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSalida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cantidadPersonas?: NullableIntFieldUpdateOperationsInput | number | null
    reservaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ultimaDisponibilidadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    telefono?: StringFieldUpdateOperationsInput | string
    mode?: EnumConversationModeFieldUpdateOperationsInput | $Enums.ConversationMode
    step?: EnumBookingStepFieldUpdateOperationsInput | $Enums.BookingStep
    nombreCliente?: NullableStringFieldUpdateOperationsInput | string | null
    fechaEntrada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaSalida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cantidadPersonas?: NullableIntFieldUpdateOperationsInput | number | null
    reservaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ultimaDisponibilidadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ReservaCreateManyHabitacionInput = {
    id?: string
    codigo: string
    clienteId: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservaUpdateWithoutHabitacionInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutReservasNestedInput
    pago?: PagoUpdateOneWithoutReservaNestedInput
  }

  export type ReservaUncheckedUpdateWithoutHabitacionInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pago?: PagoUncheckedUpdateOneWithoutReservaNestedInput
  }

  export type ReservaUncheckedUpdateManyWithoutHabitacionInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservaCreateManyClienteInput = {
    id?: string
    codigo: string
    habitacionId: string
    fechaEntrada: Date | string
    fechaSalida: Date | string
    cantidadPersonas: number
    cantidadNoches: number
    precioPorNoche: Decimal | DecimalJsLike | number | string
    precioTotal: Decimal | DecimalJsLike | number | string
    estado?: $Enums.EstadoReserva
    expiraEn?: Date | string | null
    observaciones?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReservaUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    habitacion?: HabitacionUpdateOneRequiredWithoutReservasNestedInput
    pago?: PagoUpdateOneWithoutReservaNestedInput
  }

  export type ReservaUncheckedUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    habitacionId?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pago?: PagoUncheckedUpdateOneWithoutReservaNestedInput
  }

  export type ReservaUncheckedUpdateManyWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    habitacionId?: StringFieldUpdateOperationsInput | string
    fechaEntrada?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaSalida?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidadPersonas?: IntFieldUpdateOperationsInput | number
    cantidadNoches?: IntFieldUpdateOperationsInput | number
    precioPorNoche?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    precioTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumEstadoReservaFieldUpdateOperationsInput | $Enums.EstadoReserva
    expiraEn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyConversationInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    toolName?: string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MessageUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    toolName?: NullableStringFieldUpdateOperationsInput | string | null
    toolData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}