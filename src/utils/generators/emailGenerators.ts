export interface ISupportEmailGeneratorArguments {
  userID: number;
  userMessage: string;
  userFirstName: string;
  userLastName: string;
  userEmailAddress: string;
}

export interface IUserEmailGeneratorArguments {
  userMessage: string;
  userFirstName: string;
}

export function generateHTMLForEmailToSupport(
  information: ISupportEmailGeneratorArguments,
): string {
  const HTMLForEmail = `
  <html>
    <head></head>
    <body style="font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin: 0; padding: 40px 40px 40px 40px; background-color: #EBF0F4;">
      <div style="max-width: 600px; width: 100%; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #14151A; font-size: 24px; font-style: normal; font-weight: 600; line-height: 34px; margin-bottom: 20px; border-bottom: 1px solid #E1E5ED">New Support Request</h1>
          <div style="border-bottom: 1px solid #E1E5ED; padding-bottom: 10px; margin-bottom: 10px;">
              <p style="font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; margin-bottom: 8px; color: #50576B;"><strong>User First Name:</strong> ${information.userFirstName}</p>
              <p style="font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; margin-bottom: 8px; color: #50576B;"><strong>User Last Name:</strong> ${information.userLastName}</p>
              <p style="font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; margin-bottom: 8px; color: #50576B;"><strong>User Email Address:</strong> ${information.userEmailAddress}</p>
          </div>
          <div style="font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; color: #14151A;">
              <p>${information.userMessage}</p>
          </div>
      </div>
    </body>
  </html>`;

  return HTMLForEmail;
}

export function generateHTMLForEmailToUser(information: IUserEmailGeneratorArguments): string {
  const HTMLForEmail = `
  <html>
    <head></head>
    <body style="font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin: 0; padding: 40px 0 40px 0; background-color: #EBF0F4;">
      <div style="max-width: 600px; width: 100%; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #14151A; font-size: 24px; font-style: normal; font-weight: 600; line-height: 34px; margin-bottom: 20px; border-bottom: 1px solid #E1E5ED">Support Request</h1>
          <div style="border-bottom: 1px solid #E1E5ED; padding-bottom: 10px; margin-bottom: 10px;">
              <p style="font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; margin-bottom: 8px; color: #14151A;"><strong>Hello, ${information.userFirstName}! We received a message from you:</p>
              <p style="font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; margin-bottom: 8px; color: #50576B;"><strong>${information.userMessage}</p>
          </div>
          <div style="font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; color: #14151A;">
              <p>We will try to get back to you as soon as possible, thank you :)</p>
          </div>
      </div>
    </body>
  </html>`;

  return HTMLForEmail;
}
