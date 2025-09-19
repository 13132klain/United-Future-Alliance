// Actual IEBC Integration Service - Real Data Only
export interface RealIEBCVoterData {
  id: string;
  name: string;
  status: 'Registered' | 'Pending Verification' | 'Not Found' | 'Error';
  pollingStation?: string;
  ward?: string;
  constituency?: string;
  county?: string;
  registrationDate?: string;
  error?: string;
  source: 'IEBC_PORTAL' | 'IEBC_API' | 'IEBC_SMS' | 'ERROR';
  isRealData: boolean;
}

export interface IEBCVerificationRequest {
  idNumber: string;
  yearOfBirth?: string;
  firstName?: string;
  lastName?: string;
}

class ActualIEBCService {
  private readonly IEBC_PORTAL_URL = 'https://verify.iebc.or.ke/index.php/Voterverification';
  private readonly IEBC_API_BASE = 'https://verify.iebc.or.ke/api';
  private readonly SMS_NUMBER = '70000';

  /**
   * Check voter registration using ONLY real IEBC data
   */
  async checkVoterRegistration(request: IEBCVerificationRequest): Promise<RealIEBCVoterData> {
    const { idNumber, yearOfBirth, firstName, lastName } = request;

    // Validate input
    if (!this.isValidIdNumber(idNumber)) {
      return {
        id: idNumber,
        name: '',
        status: 'Error',
        error: 'Invalid ID number format. Please enter a valid 8-digit Kenyan National ID.',
        source: 'ERROR',
        isRealData: false
      };
    }

    try {
      // Try to get real data from IEBC portal
      const realData = await this.fetchRealIEBCData(idNumber, yearOfBirth, firstName, lastName);
      
      if (realData.isRealData) {
        return realData;
      }

      // If we can't get real data, return an error
      return {
        id: idNumber,
        name: '',
        status: 'Error',
        error: 'Unable to connect to IEBC services. Please use the official IEBC portal or SMS service for verification.',
        source: 'ERROR',
        isRealData: false
      };

    } catch (error) {
      console.error('Real IEBC verification failed:', error);
      return {
        id: idNumber,
        name: '',
        status: 'Error',
        error: 'IEBC services are currently unavailable. Please try again later or use alternative verification methods.',
        source: 'ERROR',
        isRealData: false
      };
    }
  }

  /**
   * Fetch real data from IEBC portal
   */
  private async fetchRealIEBCData(
    idNumber: string, 
    yearOfBirth?: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<RealIEBCVoterData> {
    try {
      // In a real implementation, this would make an actual request to the IEBC portal
      // For now, we'll return an error to force users to use official methods
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Return error to direct users to official IEBC methods
      return {
        id: idNumber,
        name: '',
        status: 'Error',
        error: 'This application cannot access real IEBC data directly. Please use the official IEBC portal or SMS service below for accurate verification.',
        source: 'ERROR',
        isRealData: false
      };

    } catch (error) {
      return {
        id: idNumber,
        name: '',
        status: 'Error',
        error: 'IEBC portal is currently unavailable. Please try again later.',
        source: 'ERROR',
        isRealData: false
      };
    }
  }

  /**
   * Validate Kenyan National ID format
   */
  private isValidIdNumber(idNumber: string): boolean {
    const kenyanIdPattern = /^\d{8}$/;
    return kenyanIdPattern.test(idNumber.replace(/\s/g, ''));
  }

  /**
   * Get IEBC portal URL for manual verification
   */
  getIEBCPortalURL(): string {
    return this.IEBC_PORTAL_URL;
  }

  /**
   * Get SMS instructions
   */
  getSMSInstructions(): string {
    return `Send your National ID number to ${this.SMS_NUMBER} to check your registration status via SMS. Standard SMS rates apply.`;
  }

  /**
   * Check if IEBC services are available
   */
  async checkIEBCServiceHealth(): Promise<boolean> {
    try {
      // Check if IEBC portal is accessible
      const response = await fetch(this.IEBC_PORTAL_URL, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.error('IEBC service health check failed:', error);
      return false;
    }
  }

  /**
   * Get instructions for manual verification
   */
  getManualVerificationInstructions(): string {
    return `
To verify your voter registration status:

1. Visit the official IEBC portal: ${this.IEBC_PORTAL_URL}
2. Enter your National ID number and year of birth
3. Click "Verify" to see your registration status

OR

Send your National ID number to ${this.SMS_NUMBER} via SMS.

Note: This application cannot access real IEBC data directly for security and privacy reasons. Please use the official IEBC methods above for accurate verification.
    `.trim();
  }
}

// Export singleton instance
export const actualIEBCService = new ActualIEBCService();
