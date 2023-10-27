import prisma from "@/prisma/client";

export async function getGraphRevenue(storeId: string) {
  const paidOrders = await prisma.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue = Array.from({ length: 12 }, () => 0);

  paidOrders.forEach((order) => {
    const month = order.createdAt.getMonth();
    let revenue = 0;

    order.orderItems.forEach((item) => {
      revenue += item.product.price.toNumber();
    });

    monthlyRevenue[month] += revenue;
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const graphData = monthNames.map((name, index) => ({
    name,
    total: monthlyRevenue[index],
  }));

  return graphData;
}
