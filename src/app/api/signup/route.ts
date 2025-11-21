export const runtime = "nodejs";

import { AUTH_TYPE } from "@/const/authType";
import { BLOOD_GROUP } from "@/const/bloodGroup";
import { GENDER } from "@/const/gender";
import { SIZE_IN_BYTES } from "@/const/sizeInByte";
import { NextResponse } from "next/server";
// import firebaseAdmin from 'firebase-admin'
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";
import { FIREBASE } from "@/const/firebase";

export async function POST(req: Request) {
  try {
    // Read form data
    const token = req.headers.get("authorization")?.split(" ").at(1);

    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const gender = formData.get("gender") as Partial<Gender>;
    const age = formData.get("age") as string;
    const bloodGroup = formData.get("blood_group") as Partial<BloodGroup>;
    const previousIllness = formData.get("previous_illness") as string;
    const authType = formData.get("auth_type") as AuthType;
    // const avatar = formData.get("avatar") as File | null;

    const ageInt = parseInt(age);

    if (
      !name ||
      !email ||
      !gender ||
      !GENDER.includes(gender) ||
      !age ||
      isNaN(ageInt) ||
      ageInt > 150 ||
      ageInt < 3 ||
      !bloodGroup ||
      !BLOOD_GROUP.includes(bloodGroup) ||
      !previousIllness ||
      !AUTH_TYPE.includes(authType)
      // !avatar
      // !avatar.type.includes("webp")
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // if (avatar.size > SIZE_IN_BYTES.FIVE_MB) {
    //   return NextResponse.json({ error: "Avatar is too big, limit is 5mb" }, { status: 400 });
    // }

    let userData: DecodedIdToken;

    try {
      userData = await adminAuth.verifyIdToken(token);
      if (!userData) throw new Error("no user");
      if (email !== userData.email) throw new Error("Email not valid");
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: "Auth token not valid" }, { status: 401 });
    }

    // const bucket = storage.bucket();
    // const filePath = `${userData.uid}/profile.webp`;
    // const fileRef = adminStorage.bucket().file(filePath);
    // const buffer = Buffer.from(await avatar.arrayBuffer());
    // await fileRef.save(buffer, {
    //   contentType: avatar.type,
    //   public: true,
    // });
    // const publicUrl = `https://storage.googleapis.com/${fileRef.bucket.name}/${fileRef.name}`;

    const time = new Date().getTime();

    const userObj: UserObj = {
      email,
      name,
      gender,
      age: ageInt,
      bloodGroup,
      previousIllness,
      authType,
      // avatar,
      // profileUrl: publicUrl,
      uid: userData.uid,
      createdAt: time,
      updatedAt: time,
    };
    //userData.uid
    await adminDb.collection(FIREBASE.COLLECTIONS.USER).doc(userData.uid).set(userObj);

    return NextResponse.json(
      {
        message: "Signup successful",
        data: userObj,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: `${error}` },
      { status: 500 }
    );
  }
}
