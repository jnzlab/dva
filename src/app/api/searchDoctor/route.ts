// app/api/searchDoctor/route.ts
import { NextResponse } from 'next/server';

const PMC_API_BASE_URL = 'https://pmc.gov.pk/api/DRC';

export async function POST(request: Request) {
  const { registrationNo } = await request.json();

  try {
    // First, fetch basic doctor information
    const doctorResponse = await fetch(`${PMC_API_BASE_URL}/GetData`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ RegistrationNo: registrationNo, Name: '', FatherName: '' }),
    });

    const doctorData = await doctorResponse.json();

    if (!doctorData.status || doctorData.data.length === 0) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }

    const doctor = doctorData.data[0];

    // Second, fetch the doctor’s qualifications
    const qualificationResponse = await fetch(`${PMC_API_BASE_URL}/GetQualifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ RegistrationNo: registrationNo }),
    });

    const qualificationData = await qualificationResponse.json();

    // Add qualifications data to doctor data if available
    doctor.qualifications = qualificationData.status ? qualificationData.data.Qualifications : [];

    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}
