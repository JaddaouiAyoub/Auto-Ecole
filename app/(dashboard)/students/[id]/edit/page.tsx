import { notFound } from "next/navigation";
import { getStudent } from "@/actions/students";
import { StudentForm } from "@/components/students/student-form";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) {
    notFound();
  }

  // Map database entity to form data matching Zod schema
  const initialData = {
    id: student.id,
    firstName: student.firstName,
    lastName: student.lastName,
    cin: student.cin,
    phone: student.phone,
    email: student.email || "",
    address: student.address || "",
    licenseCategory: student.licenseCategory,
    totalPrice: Number(student.totalPrice),
    status: student.status,
  };

  return <StudentForm initialData={initialData} isEdit />;
}
