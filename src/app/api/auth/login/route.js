import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();
  
  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400 }
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400 }
      );

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({ message: "Login successful", token }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
