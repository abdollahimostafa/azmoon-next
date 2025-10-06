
import { Smsir } from 'sms-typescript/lib'

const smsWebService = new Smsir(
  process.env.SMS_ACCESS_KEY!,   // from SMS.ir
  30008608080808  // SMS.ir line
)

export const sendSMSCode = async (mobile: string, code: string) => {
  return smsWebService.SendVerifyCode(
    mobile,
    Number(process.env.SMS_TEMPLATE_ID),
    [{ name: 'Code', value: code }]
  )
}
    