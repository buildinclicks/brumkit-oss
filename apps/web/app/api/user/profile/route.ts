import { auth } from '@repo/auth';
import { db } from '@repo/database';
import { updateUserProfileSchema } from '@repo/validation';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = updateUserProfileSchema.parse(body);

    // Check if username is taken (if provided and different from current)
    if (validatedData.username) {
      const existingUser = await db.user.findFirst({
        where: {
          username: validatedData.username,
          NOT: { id: session.user.id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        username: validatedData.username,
        bio: validatedData.bio,
        image: validatedData.image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        image: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
