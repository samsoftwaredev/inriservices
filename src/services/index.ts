/* firestoreService.ts
 *
 * Firestore CRUD helpers (soft-delete only) for:
 * - companies
 * - users
 * - user stubs (invites) under companies/{companyId}/userStubs
 * - clients under companies/{companyId}/clients
 * - buildings under .../clients/{clientId}/buildings
 * - rooms under .../buildings/{buildingId}/rooms
 *
 * Firebase v9+ modular SDK.
 */

import {
  getFirestore,
  Firestore,
  Timestamp,
  DocumentReference,
  DocumentSnapshot,
  CollectionReference,
  QueryConstraint,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  collection,
  collectionGroup,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

/** -------------------------------------------------------
 * Setup
 * ------------------------------------------------------ */

// If you already initialize Firebase elsewhere, pass the app instance:
//   export const db = getFirestore(app);
export const db: Firestore = getFirestore();

/** -------------------------------------------------------
 * Types
 * ------------------------------------------------------ */

export type Role = "superadmin" | "company_admin" | "company_user";
export type UserStatus = "active" | "invited" | "disabled";

export type StubStatus = "invited" | "claimed" | "revoked";

export type MeasurementUnit = "ft" | "m";

export interface AuditFields {
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface SoftDeleteFields {
  isDeleted: boolean;
  deletedAt?: Timestamp | null;
  deletedBy?: string | null;
}

export type WithMeta<T> = T & { id: string };

export interface Company extends AuditFields, SoftDeleteFields {
  id: string;
  name: string;
  ownerUserId: string;
  status: "active" | "suspended";
}

export interface AppUser extends AuditFields, SoftDeleteFields {
  uid: string; // doc id
  companyId: string;
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
}

export interface UserStub extends AuditFields, SoftDeleteFields {
  id: string;
  companyId: string;
  email: string;
  role: Exclude<Role, "superadmin">; // admin/user
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  status: StubStatus;
  invitedBy: string | null;
  claimedByUid?: string | null;
  claimedAt?: Timestamp | null;
}

export interface Client extends AuditFields, SoftDeleteFields {
  id: string;
  companyId: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
}

export interface Building extends AuditFields, SoftDeleteFields {
  id: string;
  companyId: string;
  clientId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  measurementUnit: MeasurementUnit;
  floorPlan: number;
}

export interface Room extends AuditFields, SoftDeleteFields {
  id: string;
  companyId: string;
  clientId: string;
  buildingId: string;
  name: string;
  description: string;
  floorNumber: number;
}

/** Pagination response */
export interface ListResult<T> {
  items: Array<WithMeta<T>>;
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

/** -------------------------------------------------------
 * Helpers
 * ------------------------------------------------------ */

const baseAuditFields = (): Partial<AuditFields> => ({
  createdAt: null, // will be serverTimestamp()
  updatedAt: null, // will be serverTimestamp()
});

const baseSoftDeleteFields = (): SoftDeleteFields => ({
  isDeleted: false,
});

const withCreateAudit = <T extends object>(
  data: T,
  createdBy?: string | null
): T & AuditFields & SoftDeleteFields => {
  return {
    ...(data as T),
    ...baseAuditFields(),
    ...baseSoftDeleteFields(),
    createdAt: serverTimestamp() as unknown as Timestamp,
    updatedAt: serverTimestamp() as unknown as Timestamp,
    createdBy: createdBy ?? null,
    updatedBy: createdBy ?? null,
  };
};

const withUpdateAudit = <T extends object>(
  patch: T,
  updatedBy?: string | null
): T & Partial<AuditFields> => {
  return {
    ...(patch as T),
    updatedAt: serverTimestamp() as unknown as Timestamp,
    updatedBy: updatedBy ?? null,
  };
};

const softDeletePatch = (
  uid?: string | null
): Partial<SoftDeleteFields & AuditFields> => ({
  isDeleted: true,
  deletedAt: serverTimestamp() as unknown as Timestamp,
  deletedBy: uid ?? null,
  updatedAt: serverTimestamp() as unknown as Timestamp,
});

/**
 * Read doc and enforce not-deleted unless allowDeleted = true.
 */
async function requireDoc<T extends { isDeleted?: boolean }>(
  ref: DocumentReference<DocumentData>,
  opts?: { allowDeleted?: boolean }
): Promise<WithMeta<T>> {
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Document not found.");
  const data = snap.data() as T;
  if (!opts?.allowDeleted && data?.isDeleted)
    throw new Error("Document is deleted.");
  return { id: snap.id, ...(data as T) };
}

/** -------------------------------------------------------
 * Generic CRUD
 * ------------------------------------------------------ */

export async function createDoc<T extends object>(
  collectionRef: CollectionReference<DocumentData>,
  data: T,
  opts?: { createdBy?: string }
): Promise<string> {
  const payload = withCreateAudit(data, opts?.createdBy);
  const ref = await addDoc(collectionRef, payload);
  return ref.id;
}

export async function setDocByRef<T extends object>(
  docRef: DocumentReference<DocumentData>,
  data: T,
  opts?: { createdBy?: string }
): Promise<string> {
  const payload = withCreateAudit(data, opts?.createdBy);
  await setDoc(docRef, payload, { merge: false });
  return docRef.id;
}

export async function updateDocByRef<T extends object>(
  docRef: DocumentReference<DocumentData>,
  patch: T,
  opts?: { updatedBy?: string }
): Promise<string> {
  await updateDoc(docRef, withUpdateAudit(patch, opts?.updatedBy));
  return docRef.id;
}

export async function softDeleteDocByRef(
  docRef: DocumentReference<DocumentData>,
  opts?: { deletedBy?: string }
): Promise<string> {
  await updateDoc(docRef, softDeletePatch(opts?.deletedBy));
  return docRef.id;
}

export async function readDocByRef<T extends { isDeleted?: boolean }>(
  docRef: DocumentReference<DocumentData>,
  opts?: { allowDeleted?: boolean }
): Promise<WithMeta<T>> {
  return requireDoc<T>(docRef, opts);
}

export async function listDocs<T extends object>(
  collectionRef: CollectionReference<DocumentData>,
  params?: {
    filters?: Array<{
      field: string;
      op: FirebaseFirestoreWhereOp;
      value: unknown;
    }>;
    order?: { field: string; direction: "asc" | "desc" } | null;
    pageSize?: number;
    startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null;
    includeDeleted?: boolean;
  }
): Promise<ListResult<T>> {
  const {
    filters = [],
    order = { field: "createdAt", direction: "desc" },
    pageSize = 50,
    startAfterDoc = null,
    includeDeleted = false,
  } = params ?? {};

  const constraints: QueryConstraint[] = [];

  if (!includeDeleted) constraints.push(where("isDeleted", "==", false));

  for (const f of filters)
    constraints.push(where(f.field, f.op as any, f.value));

  if (order) constraints.push(orderBy(order.field, order.direction));
  constraints.push(limit(pageSize));

  if (startAfterDoc) constraints.push(startAfter(startAfterDoc));

  const snap = await getDocs(query(collectionRef, ...constraints));
  const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
  const lastDoc = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
  return { items, lastDoc };
}

/**
 * Firestore `where` operator union (keeps file self-contained)
 */
export type FirebaseFirestoreWhereOp =
  | "<"
  | "<="
  | "=="
  | "!="
  | ">="
  | ">"
  | "array-contains"
  | "in"
  | "array-contains-any"
  | "not-in";

/** -------------------------------------------------------
 * Path builders
 * ------------------------------------------------------ */

export const refs = {
  // Companies
  company: (companyId: string) => doc(db, "companies", companyId),
  companies: () => collection(db, "companies"),

  // Users
  user: (uid: string) => doc(db, "users", uid),
  users: () => collection(db, "users"),

  // User stubs
  userStub: (companyId: string, stubId: string) =>
    doc(db, "companies", companyId, "userStubs", stubId),
  userStubs: (companyId: string) =>
    collection(db, "companies", companyId, "userStubs"),

  // Clients
  client: (companyId: string, clientId: string) =>
    doc(db, "companies", companyId, "clients", clientId),
  clients: (companyId: string) =>
    collection(db, "companies", companyId, "clients"),

  // Buildings
  building: (companyId: string, clientId: string, buildingId: string) =>
    doc(
      db,
      "companies",
      companyId,
      "clients",
      clientId,
      "buildings",
      buildingId
    ),
  buildings: (companyId: string, clientId: string) =>
    collection(db, "companies", companyId, "clients", clientId, "buildings"),

  // Rooms
  room: (
    companyId: string,
    clientId: string,
    buildingId: string,
    roomId: string
  ) =>
    doc(
      db,
      "companies",
      companyId,
      "clients",
      clientId,
      "buildings",
      buildingId,
      "rooms",
      roomId
    ),
  rooms: (companyId: string, clientId: string, buildingId: string) =>
    collection(
      db,
      "companies",
      companyId,
      "clients",
      clientId,
      "buildings",
      buildingId,
      "rooms"
    ),
};

/** -------------------------------------------------------
 * Company API
 * ------------------------------------------------------ */

export const companyApi = {
  async createCompany(
    input: Pick<Company, "name" | "ownerUserId">,
    opts?: { createdBy?: string }
  ): Promise<string> {
    const id = await createDoc(
      refs.companies(),
      { ...input, status: "active" },
      opts
    );
    await updateDocByRef(
      refs.company(id),
      { id },
      { updatedBy: opts?.createdBy }
    );
    return id;
  },

  async getCompany(
    companyId: string,
    opts?: { allowDeleted?: boolean }
  ): Promise<WithMeta<Company>> {
    return readDocByRef<Company>(refs.company(companyId), opts);
  },

  async updateCompany(
    companyId: string,
    patch: Partial<Company>,
    opts?: { updatedBy?: string }
  ) {
    const safePatch = { ...patch };
    delete (safePatch as any).id;
    return updateDocByRef(refs.company(companyId), safePatch, opts);
  },

  async softDeleteCompany(companyId: string, opts?: { deletedBy?: string }) {
    return softDeleteDocByRef(refs.company(companyId), opts);
  },

  async listCompanies(params?: {
    pageSize?: number;
    startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null;
    includeDeleted?: boolean;
  }): Promise<ListResult<Company>> {
    return listDocs<Company>(refs.companies(), {
      pageSize: params?.pageSize,
      startAfterDoc: params?.startAfterDoc ?? null,
      includeDeleted: params?.includeDeleted ?? false,
      order: { field: "createdAt", direction: "desc" },
    });
  },
};

/** -------------------------------------------------------
 * User API
 * ------------------------------------------------------ */

export const userApi = {
  async createUser(
    uid: string,
    data: Omit<AppUser, keyof AuditFields | keyof SoftDeleteFields | "uid"> & {
      uid?: string;
    },
    opts?: { createdBy?: string }
  ): Promise<string> {
    const docRef = refs.user(uid);
    await setDocByRef(docRef, { ...data, uid }, opts);
    return uid;
  },

  async getUser(
    uid: string,
    opts?: { allowDeleted?: boolean }
  ): Promise<WithMeta<AppUser>> {
    return readDocByRef<AppUser>(refs.user(uid), opts);
  },

  async updateUser(
    uid: string,
    patch: Partial<AppUser>,
    opts?: { updatedBy?: string }
  ) {
    const safePatch = { ...patch };
    delete (safePatch as any).uid;
    delete (safePatch as any).companyId; // usually should not change
    return updateDocByRef(refs.user(uid), safePatch, opts);
  },

  async disableUser(uid: string, opts?: { updatedBy?: string }) {
    return updateDocByRef(refs.user(uid), { status: "disabled" }, opts);
  },

  async softDeleteUser(uid: string, opts?: { deletedBy?: string }) {
    return softDeleteDocByRef(refs.user(uid), opts);
  },

  async listUsersByCompany(
    companyId: string,
    params?: {
      pageSize?: number;
      startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null;
      includeDeleted?: boolean;
    }
  ): Promise<ListResult<AppUser>> {
    return listDocs<AppUser>(refs.users(), {
      filters: [{ field: "companyId", op: "==", value: companyId }],
      pageSize: params?.pageSize,
      startAfterDoc: params?.startAfterDoc ?? null,
      includeDeleted: params?.includeDeleted ?? false,
      order: { field: "createdAt", direction: "desc" },
    });
  },
};

/** -------------------------------------------------------
 * User Stub API (Option B)
 * ------------------------------------------------------ */

export const userStubApi = {
  async createUserStub(
    companyId: string,
    input: Pick<UserStub, "email" | "role"> &
      Partial<Pick<UserStub, "firstName" | "lastName" | "phone">>,
    opts?: { createdBy?: string }
  ): Promise<string> {
    const createdBy = opts?.createdBy ?? null;

    const id = await createDoc(
      refs.userStubs(companyId),
      {
        id: null as unknown as string,
        companyId,
        email: String(input.email).trim().toLowerCase(),
        role: input.role,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        phone: input.phone ?? null,
        status: "invited" as StubStatus,
        invitedBy: createdBy,
        claimedByUid: null,
        claimedAt: null,
      },
      { createdBy: createdBy ?? undefined }
    );

    await updateDocByRef(
      refs.userStub(companyId, id),
      { id },
      { updatedBy: opts?.createdBy }
    );
    return id;
  },

  async getUserStub(
    companyId: string,
    stubId: string,
    opts?: { allowDeleted?: boolean }
  ): Promise<WithMeta<UserStub>> {
    return readDocByRef<UserStub>(refs.userStub(companyId, stubId), opts);
  },

  async updateUserStub(
    companyId: string,
    stubId: string,
    patch: Partial<UserStub>,
    opts?: { updatedBy?: string }
  ) {
    const safePatch = { ...patch };
    delete (safePatch as any).companyId;
    delete (safePatch as any).id;
    delete (safePatch as any).claimedByUid;
    delete (safePatch as any).claimedAt;
    return updateDocByRef(refs.userStub(companyId, stubId), safePatch, opts);
  },

  async revokeUserStub(
    companyId: string,
    stubId: string,
    opts?: { updatedBy?: string }
  ) {
    return updateDocByRef(
      refs.userStub(companyId, stubId),
      { status: "revoked" },
      opts
    );
  },

  async softDeleteUserStub(
    companyId: string,
    stubId: string,
    opts?: { deletedBy?: string }
  ) {
    return softDeleteDocByRef(refs.userStub(companyId, stubId), opts);
  },

  async listUserStubs(
    companyId: string,
    params?: {
      pageSize?: number;
      startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null;
      includeDeleted?: boolean;
    }
  ): Promise<ListResult<UserStub>> {
    return listDocs<UserStub>(refs.userStubs(companyId), {
      pageSize: params?.pageSize,
      startAfterDoc: params?.startAfterDoc ?? null,
      includeDeleted: params?.includeDeleted ?? false,
      order: { field: "createdAt", direction: "desc" },
    });
  },

  async findInvitedStubsByEmail(
    email: string,
    opts?: { includeDeleted?: boolean }
  ) {
    const normalized = String(email).trim().toLowerCase();

    const constraints: QueryConstraint[] = [
      where("email", "==", normalized),
      where("status", "==", "invited"),
    ];
    if (!opts?.includeDeleted)
      constraints.push(where("isDeleted", "==", false));

    const q = query(collectionGroup(db, "userStubs"), ...constraints);
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      ...(d.data() as UserStub),
      _refPath: d.ref.path,
      id: d.id,
    }));
  },

  /**
   * Claim a stub into a real user doc (transaction).
   * Best done server-side or with strict rules.
   */
  async claimStubToUser(args: {
    companyId: string;
    stubId: string;
    uid: string;
    authEmail: string;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
  }): Promise<string> {
    const { companyId, stubId, uid, authEmail, firstName, lastName, phone } =
      args;

    const stubRef = refs.userStub(companyId, stubId);
    const userRef = refs.user(uid);

    await runTransaction(db, async (tx) => {
      const stubSnap = await tx.get(stubRef);
      if (!stubSnap.exists()) throw new Error("Invite not found.");

      const stub = stubSnap.data() as UserStub;

      if (stub.isDeleted) throw new Error("Invite is deleted.");
      if (stub.status !== "invited")
        throw new Error("Invite is not available.");
      if (
        String(stub.email).toLowerCase() !== String(authEmail).toLowerCase()
      ) {
        throw new Error("Email does not match invite.");
      }

      // Create user doc
      const userData: Omit<
        AppUser,
        keyof AuditFields | keyof SoftDeleteFields
      > = {
        uid,
        companyId,
        role: stub.role,
        email: stub.email,
        firstName: firstName ?? stub.firstName ?? "",
        lastName: lastName ?? stub.lastName ?? "",
        phone: phone ?? stub.phone ?? null,
        status: "active",
      };

      tx.set(userRef, withCreateAudit(userData, uid), { merge: false });

      // Mark stub claimed
      tx.update(
        stubRef,
        withUpdateAudit(
          {
            status: "claimed",
            claimedByUid: uid,
            claimedAt: serverTimestamp(),
          },
          uid
        )
      );
    });

    return uid;
  },
};

/** -------------------------------------------------------
 * Client / Building / Room APIs
 * ------------------------------------------------------ */

export const clientApi = {
  async createClient(
    companyId: string,
    input: Omit<
      Client,
      keyof AuditFields | keyof SoftDeleteFields | "id" | "companyId"
    >,
    opts?: { createdBy?: string }
  ): Promise<string> {
    const id = await createDoc(
      refs.clients(companyId),
      {
        id: null as unknown as string,
        companyId,
        ...input,
      },
      opts
    );
    await updateDocByRef(
      refs.client(companyId, id),
      { id },
      { updatedBy: opts?.createdBy }
    );
    return id;
  },

  async getClient(
    companyId: string,
    clientId: string,
    opts?: { allowDeleted?: boolean }
  ) {
    return readDocByRef<Client>(refs.client(companyId, clientId), opts);
  },

  async updateClient(
    companyId: string,
    clientId: string,
    patch: Partial<Client>,
    opts?: { updatedBy?: string }
  ) {
    const safePatch = { ...patch };
    delete (safePatch as any).companyId;
    delete (safePatch as any).id;
    return updateDocByRef(refs.client(companyId, clientId), safePatch, opts);
  },

  async softDeleteClient(
    companyId: string,
    clientId: string,
    opts?: { deletedBy?: string }
  ) {
    return softDeleteDocByRef(refs.client(companyId, clientId), opts);
  },

  async listClients(
    companyId: string,
    params?: {
      pageSize?: number;
      startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null;
      includeDeleted?: boolean;
    }
  ) {
    return listDocs<Client>(refs.clients(companyId), {
      pageSize: params?.pageSize,
      startAfterDoc: params?.startAfterDoc ?? null,
      includeDeleted: params?.includeDeleted ?? false,
      order: { field: "createdAt", direction: "desc" },
    });
  },
};

export const buildingApi = {
  async createBuilding(
    companyId: string,
    clientId: string,
    input: Omit<
      Building,
      | keyof AuditFields
      | keyof SoftDeleteFields
      | "id"
      | "companyId"
      | "clientId"
    >,
    opts?: { createdBy?: string }
  ): Promise<string> {
    const id = await createDoc(
      refs.buildings(companyId, clientId),
      {
        id: null as unknown as string,
        companyId,
        clientId,
        measurementUnit: input.measurementUnit ?? "ft",
        floorPlan: input.floorPlan ?? 1,
        address: input.address,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
      },
      opts
    );
    await updateDocByRef(
      refs.building(companyId, clientId, id),
      { id },
      { updatedBy: opts?.createdBy }
    );
    return id;
  },

  async getBuilding(
    companyId: string,
    clientId: string,
    buildingId: string,
    opts?: { allowDeleted?: boolean }
  ) {
    return readDocByRef<Building>(
      refs.building(companyId, clientId, buildingId),
      opts
    );
  },

  async updateBuilding(
    companyId: string,
    clientId: string,
    buildingId: string,
    patch: Partial<Building>,
    opts?: { updatedBy?: string }
  ) {
    const safePatch = { ...patch };
    delete (safePatch as any).companyId;
    delete (safePatch as any).clientId;
    delete (safePatch as any).id;
    return updateDocByRef(
      refs.building(companyId, clientId, buildingId),
      safePatch,
      opts
    );
  },

  async softDeleteBuilding(
    companyId: string,
    clientId: string,
    buildingId: string,
    opts?: { deletedBy?: string }
  ) {
    return softDeleteDocByRef(
      refs.building(companyId, clientId, buildingId),
      opts
    );
  },

  async listBuildings(
    companyId: string,
    clientId: string,
    params?: {
      pageSize?: number;
      startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null;
      includeDeleted?: boolean;
    }
  ) {
    return listDocs<Building>(refs.buildings(companyId, clientId), {
      pageSize: params?.pageSize,
      startAfterDoc: params?.startAfterDoc ?? null,
      includeDeleted: params?.includeDeleted ?? false,
      order: { field: "createdAt", direction: "desc" },
    });
  },
};

export const roomApi = {
  async createRoom(
    companyId: string,
    clientId: string,
    buildingId: string,
    input: Omit<
      Room,
      | keyof AuditFields
      | keyof SoftDeleteFields
      | "id"
      | "companyId"
      | "clientId"
      | "buildingId"
    >,
    opts?: { createdBy?: string }
  ): Promise<string> {
    const id = await createDoc(
      refs.rooms(companyId, clientId, buildingId),
      {
        id: null as unknown as string,
        companyId,
        clientId,
        buildingId,
        name: input.name,
        description: input.description,
        floorNumber: input.floorNumber ?? 1,
      },
      opts
    );
    await updateDocByRef(
      refs.room(companyId, clientId, buildingId, id),
      { id },
      { updatedBy: opts?.createdBy }
    );
    return id;
  },

  async getRoom(
    companyId: string,
    clientId: string,
    buildingId: string,
    roomId: string,
    opts?: { allowDeleted?: boolean }
  ) {
    return readDocByRef<Room>(
      refs.room(companyId, clientId, buildingId, roomId),
      opts
    );
  },

  async updateRoom(
    companyId: string,
    clientId: string,
    buildingId: string,
    roomId: string,
    patch: Partial<Room>,
    opts?: { updatedBy?: string }
  ) {
    const safePatch = { ...patch };
    delete (safePatch as any).companyId;
    delete (safePatch as any).clientId;
    delete (safePatch as any).buildingId;
    delete (safePatch as any).id;
    return updateDocByRef(
      refs.room(companyId, clientId, buildingId, roomId),
      safePatch,
      opts
    );
  },

  async softDeleteRoom(
    companyId: string,
    clientId: string,
    buildingId: string,
    roomId: string,
    opts?: { deletedBy?: string }
  ) {
    return softDeleteDocByRef(
      refs.room(companyId, clientId, buildingId, roomId),
      opts
    );
  },

  async listRooms(
    companyId: string,
    clientId: string,
    buildingId: string,
    params?: {
      pageSize?: number;
      startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null;
      includeDeleted?: boolean;
    }
  ) {
    return listDocs<Room>(refs.rooms(companyId, clientId, buildingId), {
      pageSize: params?.pageSize,
      startAfterDoc: params?.startAfterDoc ?? null,
      includeDeleted: params?.includeDeleted ?? false,
      order: { field: "createdAt", direction: "desc" },
    });
  },
};

/** -------------------------------------------------------
 * Convenience: cascade soft delete (optional)
 * ------------------------------------------------------ */

/**
 * Soft delete a client AND all buildings/rooms under it.
 * Warning: can be expensive for large trees. Use with care.
 */
export async function cascadeSoftDeleteClient(
  companyId: string,
  clientId: string,
  opts?: { deletedBy?: string }
) {
  await clientApi.softDeleteClient(companyId, clientId, opts);

  const buildingsSnap = await getDocs(
    query(refs.buildings(companyId, clientId), where("isDeleted", "==", false))
  );

  for (const b of buildingsSnap.docs) {
    const buildingId = b.id;
    await buildingApi.softDeleteBuilding(companyId, clientId, buildingId, opts);

    const roomsSnap = await getDocs(
      query(
        refs.rooms(companyId, clientId, buildingId),
        where("isDeleted", "==", false)
      )
    );

    for (const r of roomsSnap.docs) {
      await roomApi.softDeleteRoom(companyId, clientId, buildingId, r.id, opts);
    }
  }
}
