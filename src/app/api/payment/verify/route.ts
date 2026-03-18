import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

interface VerifyPaymentRequest {
  orderId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyPaymentRequest = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // If order is already paid, return success
    if (order.status === 'paid' || order.status === 'completed') {
      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalAmount: order.totalAmount,
        },
      });
    }

    // If there's a stripe session, check its status
    if (stripe && order.stripeSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          order.stripeSessionId
        );

        if (session.payment_status === 'paid') {
          // Update order status
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'paid',
              paidAt: new Date(),
            },
          });

          return NextResponse.json({
            success: true,
            order: {
              id: order.id,
              orderNumber: order.orderNumber,
              status: 'paid',
              totalAmount: order.totalAmount,
            },
          });
        }
      } catch (stripeError) {
        console.error('Error retrieving stripe session:', stripeError);
      }
    }

    // Payment not completed
    return NextResponse.json({
      success: false,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
