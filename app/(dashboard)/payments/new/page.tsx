import { PaymentForm } from "@/components/payments/payment-form";
import { getStudents } from "@/actions/students";

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { studentId } = await searchParams;
  
  // Fetch active students with remaining balance
  const { data: students } = await getStudents({ 
    hasBalance: true,
    status: "ACTIVE", // Only allow payments for active or suspended students generally, but here we can just fetch all that have balance
    limit: 1000 
  });

  return (
    <PaymentForm
      students={students}
      preselectedStudentId={typeof studentId === "string" ? studentId : undefined}
    />
  );
}
