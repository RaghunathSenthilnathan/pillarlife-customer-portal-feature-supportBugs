"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomMessage {
    constructor(kwargs) {
        this.FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
        Object.assign(this, kwargs);
        this.FRONTEND_LINKS = {
            SEND_CODE_POST_SIGN_UP: `${this.FRONTEND_BASE_URL}/auth/complete-registration?code=${this.codeParameter}&email=${this.userAttributes.email}`,
            SEND_CODE_FORGOT_PASSWORD: `${this.FRONTEND_BASE_URL}/auth/complete-password-reset?code=${this.codeParameter}&email=${this.userAttributes.email}`,
            SEND_CODE_VERIFY_NEW_EMAIL: `${this.FRONTEND_BASE_URL}/auth/complete-password-reset?code=${this.codeParameter}&email=${this.userAttributes.email}`,
            SEND_TEMPORARY_PASSWORD: `${this.FRONTEND_BASE_URL}/auth/login`,
            RESEND_CONFIRMATION_CODE: `${this.FRONTEND_BASE_URL}/auth/complete-registration?code=${this.codeParameter}&email=${this.userAttributes.email}`,
        };
    }
    sendCodePostSignUp() {
        return {
            emailSubject: `Validate your account for ${this.FRONTEND_BASE_URL} | ${new Date().toLocaleString()}`,
            emailMessage: `Hi <b>${this.userAttributes.email}</b>!<br>Thank you for signing up.
      <br />
      Please click on the link to activate your account: <a href="${this.FRONTEND_LINKS.SEND_CODE_POST_SIGN_UP}">${this.FRONTEND_BASE_URL}</a>.
      `,
        };
    }
    sendCodeForgotPassword() {
        return {
            emailSubject: `Reset your password for ${this.FRONTEND_BASE_URL} | ${new Date().toLocaleString()}`,
            emailMessage: `Hi <b>${this.userAttributes.email}</b>!
      
      <br />
      Please click on the link to update your password: <a href="${this.FRONTEND_LINKS.SEND_CODE_FORGOT_PASSWORD}">${this.FRONTEND_BASE_URL}</a>.
      `,
        };
    }
    sendCodeVerifyNewEmail() {
        return {
            emailSubject: `Validate your new email for ${this.FRONTEND_BASE_URL} | ${new Date().toLocaleString()}`,
            emailMessage: `Hi <b>${this.userAttributes.email}</b>!
      <br />
      
      Please click on the link to update your email address: <a href="${this.FRONTEND_LINKS.SEND_CODE_VERIFY_NEW_EMAIL}">${this.FRONTEND_BASE_URL}</a>.
      `,
        };
    }
    sendTemporaryPassword() {
        return {
            emailSubject: `Your account for ${this.FRONTEND_BASE_URL} | ${new Date().toLocaleString()}`,
            emailMessage: `Hi User!<br>An administrator has created your credentials for ${this.FRONTEND_BASE_URL}.<br>Your username is <b>${this.usernameParameter}</b> and your temporary password is <b>${this.codeParameter}</b><br>You can paste them in the form at <a href="${this.FRONTEND_LINKS.SEND_TEMPORARY_PASSWORD}">${this.FRONTEND_BASE_URL}</a> in order to log in.`,
        };
    }
    resendConfirmationCode() {
        return {
            emailSubject: `Your sign-up confirmation link for ${this.FRONTEND_BASE_URL} | ${new Date().toLocaleString()}`,
            emailMessage: `Hi <b>${this.userAttributes.email}</b>!<br>Thank you for signing up.
      
      <br />
      Please click on the link to activate your account: <a href="${this.FRONTEND_LINKS.RESEND_CONFIRMATION_CODE}">${this.FRONTEND_BASE_URL}</a>.`,
        };
    }
}
exports.default = CustomMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLW1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b20tbWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQXFCQSxNQUFNLGFBQWE7SUFVakIsWUFBWSxNQUEwQjtRQVR0QyxzQkFBaUIsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDO1FBVWhELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTVCLElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDcEIsc0JBQXNCLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLG9DQUFvQyxJQUFJLENBQUMsYUFBYSxVQUFVLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO1lBQzVJLHlCQUF5QixFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixzQ0FBc0MsSUFBSSxDQUFDLGFBQWEsVUFBVSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtZQUNqSiwwQkFBMEIsRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsc0NBQXNDLElBQUksQ0FBQyxhQUFhLFVBQVUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7WUFDbEosdUJBQXVCLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLGFBQWE7WUFDL0Qsd0JBQXdCLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLG9DQUFvQyxJQUFJLENBQUMsYUFBYSxVQUFVLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO1NBQy9JLENBQUM7SUFDSixDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLE9BQU87WUFDTCxZQUFZLEVBQUUsNkJBQ1osSUFBSSxDQUFDLGlCQUNQLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNuQyxZQUFZLEVBQUUsU0FBUyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUs7O29FQUVjLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLEtBQUssSUFBSSxDQUFDLGlCQUFpQjtPQUNsSTtTQUNGLENBQUM7SUFDSixDQUFDO0lBRUQsc0JBQXNCO1FBQ3BCLE9BQU87WUFDTCxZQUFZLEVBQUUsMkJBQ1osSUFBSSxDQUFDLGlCQUNQLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNuQyxZQUFZLEVBQUUsU0FBUyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUs7OzttRUFHYSxJQUFJLENBQUMsY0FBYyxDQUFDLHlCQUF5QixLQUFLLElBQUksQ0FBQyxpQkFBaUI7T0FDcEk7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELHNCQUFzQjtRQUNwQixPQUFPO1lBQ0wsWUFBWSxFQUFFLCtCQUNaLElBQUksQ0FBQyxpQkFDUCxNQUFNLElBQUksSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDbkMsWUFBWSxFQUFFLFNBQVMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLOzs7d0VBR2tCLElBQUksQ0FBQyxjQUFjLENBQUMsMEJBQTBCLEtBQUssSUFBSSxDQUFDLGlCQUFpQjtPQUMxSTtTQUNGLENBQUM7SUFDSixDQUFDO0lBRUQscUJBQXFCO1FBQ25CLE9BQU87WUFDTCxZQUFZLEVBQUUsb0JBQ1osSUFBSSxDQUFDLGlCQUNQLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNuQyxZQUFZLEVBQUUsaUVBQWlFLElBQUksQ0FBQyxpQkFBaUIsNEJBQTRCLElBQUksQ0FBQyxpQkFBaUIsMENBQTBDLElBQUksQ0FBQyxhQUFhLHNEQUFzRCxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixLQUFLLElBQUksQ0FBQyxpQkFBaUIsMEJBQTBCO1NBQzFXLENBQUM7SUFDSixDQUFDO0lBRUQsc0JBQXNCO1FBQ3BCLE9BQU87WUFDTCxZQUFZLEVBQUUsc0NBQ1osSUFBSSxDQUFDLGlCQUNQLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNuQyxZQUFZLEVBQUUsU0FBUyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUs7OztvRUFHYyxJQUFJLENBQUMsY0FBYyxDQUFDLHdCQUF3QixLQUFLLElBQUksQ0FBQyxpQkFBaUIsT0FBTztTQUM3SSxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsa0JBQWUsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsidHlwZSBDdXN0b21NZXNzYWdlUHJvcHMgPSB7XG4gIGNvZGVQYXJhbWV0ZXI6IHN0cmluZztcbiAgdXNlckF0dHJpYnV0ZXM6IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG4gICAgLy8gZ2l2ZW5fbmFtZT86IHN0cmluZztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG4gICAgLy8gZmFtaWx5X25hbWU/OiBzdHJpbmc7XG4gICAgZW1haWw6IHN0cmluZztcbiAgfTtcbiAgdXNlcm5hbWVQYXJhbWV0ZXI6IHN0cmluZztcbn07XG5cbi8vIE1lcmdlIHRoZSBpbnRlcmZhY2Ugd2l0aCB0aGUgY2xhc3Ncbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktaW50ZXJmYWNlXG5pbnRlcmZhY2UgQ3VzdG9tTWVzc2FnZSBleHRlbmRzIEN1c3RvbU1lc3NhZ2VQcm9wcyB7fVxuXG50eXBlIEN1c3RvbU1lc3NhZ2VSZXR1cm5WYWx1ZSA9IHtcbiAgZW1haWxTdWJqZWN0OiBzdHJpbmc7XG4gIGVtYWlsTWVzc2FnZTogc3RyaW5nO1xufTtcblxuY2xhc3MgQ3VzdG9tTWVzc2FnZSB7XG4gIEZST05URU5EX0JBU0VfVVJMID0gcHJvY2Vzcy5lbnYuRlJPTlRFTkRfQkFTRV9VUkw7XG4gIEZST05URU5EX0xJTktTOiB7XG4gICAgU0VORF9DT0RFX1BPU1RfU0lHTl9VUDogc3RyaW5nO1xuICAgIFNFTkRfQ09ERV9GT1JHT1RfUEFTU1dPUkQ6IHN0cmluZztcbiAgICBTRU5EX0NPREVfVkVSSUZZX05FV19FTUFJTDogc3RyaW5nO1xuICAgIFNFTkRfVEVNUE9SQVJZX1BBU1NXT1JEOiBzdHJpbmc7XG4gICAgUkVTRU5EX0NPTkZJUk1BVElPTl9DT0RFOiBzdHJpbmc7XG4gIH07XG5cbiAgY29uc3RydWN0b3Ioa3dhcmdzOiBDdXN0b21NZXNzYWdlUHJvcHMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGt3YXJncyk7XG5cbiAgICB0aGlzLkZST05URU5EX0xJTktTID0ge1xuICAgICAgU0VORF9DT0RFX1BPU1RfU0lHTl9VUDogYCR7dGhpcy5GUk9OVEVORF9CQVNFX1VSTH0vYXV0aC9jb21wbGV0ZS1yZWdpc3RyYXRpb24/Y29kZT0ke3RoaXMuY29kZVBhcmFtZXRlcn0mZW1haWw9JHt0aGlzLnVzZXJBdHRyaWJ1dGVzLmVtYWlsfWAsXG4gICAgICBTRU5EX0NPREVfRk9SR09UX1BBU1NXT1JEOiBgJHt0aGlzLkZST05URU5EX0JBU0VfVVJMfS9hdXRoL2NvbXBsZXRlLXBhc3N3b3JkLXJlc2V0P2NvZGU9JHt0aGlzLmNvZGVQYXJhbWV0ZXJ9JmVtYWlsPSR7dGhpcy51c2VyQXR0cmlidXRlcy5lbWFpbH1gLFxuICAgICAgU0VORF9DT0RFX1ZFUklGWV9ORVdfRU1BSUw6IGAke3RoaXMuRlJPTlRFTkRfQkFTRV9VUkx9L2F1dGgvY29tcGxldGUtcGFzc3dvcmQtcmVzZXQ/Y29kZT0ke3RoaXMuY29kZVBhcmFtZXRlcn0mZW1haWw9JHt0aGlzLnVzZXJBdHRyaWJ1dGVzLmVtYWlsfWAsXG4gICAgICBTRU5EX1RFTVBPUkFSWV9QQVNTV09SRDogYCR7dGhpcy5GUk9OVEVORF9CQVNFX1VSTH0vYXV0aC9sb2dpbmAsXG4gICAgICBSRVNFTkRfQ09ORklSTUFUSU9OX0NPREU6IGAke3RoaXMuRlJPTlRFTkRfQkFTRV9VUkx9L2F1dGgvY29tcGxldGUtcmVnaXN0cmF0aW9uP2NvZGU9JHt0aGlzLmNvZGVQYXJhbWV0ZXJ9JmVtYWlsPSR7dGhpcy51c2VyQXR0cmlidXRlcy5lbWFpbH1gLFxuICAgIH07XG4gIH1cblxuICBzZW5kQ29kZVBvc3RTaWduVXAoKTogQ3VzdG9tTWVzc2FnZVJldHVyblZhbHVlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZW1haWxTdWJqZWN0OiBgVmFsaWRhdGUgeW91ciBhY2NvdW50IGZvciAke1xuICAgICAgICB0aGlzLkZST05URU5EX0JBU0VfVVJMXG4gICAgICB9IHwgJHtuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCl9YCxcbiAgICAgIGVtYWlsTWVzc2FnZTogYEhpIDxiPiR7dGhpcy51c2VyQXR0cmlidXRlcy5lbWFpbH08L2I+ITxicj5UaGFuayB5b3UgZm9yIHNpZ25pbmcgdXAuXG4gICAgICA8YnIgLz5cbiAgICAgIFBsZWFzZSBjbGljayBvbiB0aGUgbGluayB0byBhY3RpdmF0ZSB5b3VyIGFjY291bnQ6IDxhIGhyZWY9XCIke3RoaXMuRlJPTlRFTkRfTElOS1MuU0VORF9DT0RFX1BPU1RfU0lHTl9VUH1cIj4ke3RoaXMuRlJPTlRFTkRfQkFTRV9VUkx9PC9hPi5cbiAgICAgIGAsXG4gICAgfTtcbiAgfVxuXG4gIHNlbmRDb2RlRm9yZ290UGFzc3dvcmQoKTogQ3VzdG9tTWVzc2FnZVJldHVyblZhbHVlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZW1haWxTdWJqZWN0OiBgUmVzZXQgeW91ciBwYXNzd29yZCBmb3IgJHtcbiAgICAgICAgdGhpcy5GUk9OVEVORF9CQVNFX1VSTFxuICAgICAgfSB8ICR7bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpfWAsXG4gICAgICBlbWFpbE1lc3NhZ2U6IGBIaSA8Yj4ke3RoaXMudXNlckF0dHJpYnV0ZXMuZW1haWx9PC9iPiFcbiAgICAgIFxuICAgICAgPGJyIC8+XG4gICAgICBQbGVhc2UgY2xpY2sgb24gdGhlIGxpbmsgdG8gdXBkYXRlIHlvdXIgcGFzc3dvcmQ6IDxhIGhyZWY9XCIke3RoaXMuRlJPTlRFTkRfTElOS1MuU0VORF9DT0RFX0ZPUkdPVF9QQVNTV09SRH1cIj4ke3RoaXMuRlJPTlRFTkRfQkFTRV9VUkx9PC9hPi5cbiAgICAgIGAsXG4gICAgfTtcbiAgfVxuXG4gIHNlbmRDb2RlVmVyaWZ5TmV3RW1haWwoKTogQ3VzdG9tTWVzc2FnZVJldHVyblZhbHVlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZW1haWxTdWJqZWN0OiBgVmFsaWRhdGUgeW91ciBuZXcgZW1haWwgZm9yICR7XG4gICAgICAgIHRoaXMuRlJPTlRFTkRfQkFTRV9VUkxcbiAgICAgIH0gfCAke25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKX1gLFxuICAgICAgZW1haWxNZXNzYWdlOiBgSGkgPGI+JHt0aGlzLnVzZXJBdHRyaWJ1dGVzLmVtYWlsfTwvYj4hXG4gICAgICA8YnIgLz5cbiAgICAgIFxuICAgICAgUGxlYXNlIGNsaWNrIG9uIHRoZSBsaW5rIHRvIHVwZGF0ZSB5b3VyIGVtYWlsIGFkZHJlc3M6IDxhIGhyZWY9XCIke3RoaXMuRlJPTlRFTkRfTElOS1MuU0VORF9DT0RFX1ZFUklGWV9ORVdfRU1BSUx9XCI+JHt0aGlzLkZST05URU5EX0JBU0VfVVJMfTwvYT4uXG4gICAgICBgLFxuICAgIH07XG4gIH1cblxuICBzZW5kVGVtcG9yYXJ5UGFzc3dvcmQoKTogQ3VzdG9tTWVzc2FnZVJldHVyblZhbHVlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZW1haWxTdWJqZWN0OiBgWW91ciBhY2NvdW50IGZvciAke1xuICAgICAgICB0aGlzLkZST05URU5EX0JBU0VfVVJMXG4gICAgICB9IHwgJHtuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCl9YCxcbiAgICAgIGVtYWlsTWVzc2FnZTogYEhpIFVzZXIhPGJyPkFuIGFkbWluaXN0cmF0b3IgaGFzIGNyZWF0ZWQgeW91ciBjcmVkZW50aWFscyBmb3IgJHt0aGlzLkZST05URU5EX0JBU0VfVVJMfS48YnI+WW91ciB1c2VybmFtZSBpcyA8Yj4ke3RoaXMudXNlcm5hbWVQYXJhbWV0ZXJ9PC9iPiBhbmQgeW91ciB0ZW1wb3JhcnkgcGFzc3dvcmQgaXMgPGI+JHt0aGlzLmNvZGVQYXJhbWV0ZXJ9PC9iPjxicj5Zb3UgY2FuIHBhc3RlIHRoZW0gaW4gdGhlIGZvcm0gYXQgPGEgaHJlZj1cIiR7dGhpcy5GUk9OVEVORF9MSU5LUy5TRU5EX1RFTVBPUkFSWV9QQVNTV09SRH1cIj4ke3RoaXMuRlJPTlRFTkRfQkFTRV9VUkx9PC9hPiBpbiBvcmRlciB0byBsb2cgaW4uYCxcbiAgICB9O1xuICB9XG5cbiAgcmVzZW5kQ29uZmlybWF0aW9uQ29kZSgpOiBDdXN0b21NZXNzYWdlUmV0dXJuVmFsdWUge1xuICAgIHJldHVybiB7XG4gICAgICBlbWFpbFN1YmplY3Q6IGBZb3VyIHNpZ24tdXAgY29uZmlybWF0aW9uIGxpbmsgZm9yICR7XG4gICAgICAgIHRoaXMuRlJPTlRFTkRfQkFTRV9VUkxcbiAgICAgIH0gfCAke25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKX1gLFxuICAgICAgZW1haWxNZXNzYWdlOiBgSGkgPGI+JHt0aGlzLnVzZXJBdHRyaWJ1dGVzLmVtYWlsfTwvYj4hPGJyPlRoYW5rIHlvdSBmb3Igc2lnbmluZyB1cC5cbiAgICAgIFxuICAgICAgPGJyIC8+XG4gICAgICBQbGVhc2UgY2xpY2sgb24gdGhlIGxpbmsgdG8gYWN0aXZhdGUgeW91ciBhY2NvdW50OiA8YSBocmVmPVwiJHt0aGlzLkZST05URU5EX0xJTktTLlJFU0VORF9DT05GSVJNQVRJT05fQ09ERX1cIj4ke3RoaXMuRlJPTlRFTkRfQkFTRV9VUkx9PC9hPi5gLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3VzdG9tTWVzc2FnZTtcbiJdfQ==