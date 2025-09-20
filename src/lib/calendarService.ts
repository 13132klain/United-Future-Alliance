import { Event } from '../types';

// Calendar integration service for adding events to user calendars
export class CalendarService {
  
  // Generate Google Calendar URL
  static generateGoogleCalendarUrl(event: Event): string {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + (event.duration || 2) * 60 * 60 * 1000); // Default 2 hours if no duration
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${this.formatDateForGoogle(startDate)}/${this.formatDateForGoogle(endDate)}`,
      details: event.description || '',
      location: event.location || '',
      trp: 'false'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  // Generate Outlook Calendar URL
  static generateOutlookCalendarUrl(event: Event): string {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + (event.duration || 2) * 60 * 60 * 1000);
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      body: event.description || '',
      location: event.location || ''
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }

  // Generate Yahoo Calendar URL
  static generateYahooCalendarUrl(event: Event): string {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + (event.duration || 2) * 60 * 60 * 1000);
    
    const params = new URLSearchParams({
      v: '60',
      view: 'd',
      type: '20',
      title: event.title,
      st: this.formatDateForYahoo(startDate),
      et: this.formatDateForYahoo(endDate),
      desc: event.description || '',
      in_loc: event.location || ''
    });

    return `https://calendar.yahoo.com/?${params.toString()}`;
  }

  // Generate ICS file content for download
  static generateICSContent(event: Event): string {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + (event.duration || 2) * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const escapeText = (text: string) => {
      return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
    };

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//United Future Alliance//Event Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@ufa.org`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.description || '')}`,
      `LOCATION:${escapeText(event.location || '')}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  // Download ICS file
  static downloadICSFile(event: Event): void {
    const icsContent = this.generateICSContent(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  // Open calendar with multiple options
  static openCalendarOptions(event: Event): void {
    // Create a modal or dropdown with calendar options
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Add to Calendar</h3>
          <button class="text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mb-4">Choose your calendar application:</p>
        <div class="space-y-3">
          <a href="${this.generateGoogleCalendarUrl(event)}" target="_blank" 
             class="flex items-center w-full px-4 py-3 text-left text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div>
              <div class="font-medium">Google Calendar</div>
              <div class="text-sm text-gray-500">Add to Google Calendar</div>
            </div>
          </a>
          
          <a href="${this.generateOutlookCalendarUrl(event)}" target="_blank"
             class="flex items-center w-full px-4 py-3 text-left text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#0078D4">
              <path d="M7.5 2h9A1.5 1.5 0 0 1 18 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20.5v-17A1.5 1.5 0 0 1 7.5 2z"/>
              <path d="M8 4v16h8V4H8z" fill="white"/>
              <path d="M10 6h4v2h-4V6zm0 3h4v2h-4V9zm0 3h4v2h-4v-2z" fill="#0078D4"/>
            </svg>
            <div>
              <div class="font-medium">Outlook</div>
              <div class="text-sm text-gray-500">Add to Outlook Calendar</div>
            </div>
          </a>
          
          <button onclick="this.downloadICS()" 
                  class="flex items-center w-full px-4 py-3 text-left text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#007AFF">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <div>
              <div class="font-medium">Apple Calendar</div>
              <div class="text-sm text-gray-500">Download .ics file</div>
            </div>
          </button>
          
          <button onclick="this.downloadICS()" 
                  class="flex items-center w-full px-4 py-3 text-left text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#7B0099">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <div>
              <div class="font-medium">Other Calendars</div>
              <div class="text-sm text-gray-500">Download .ics file</div>
            </div>
          </button>
        </div>
      </div>
    `;
    
    // Add download functionality
    const downloadButton = modal.querySelector('button[onclick="this.downloadICS()"]');
    if (downloadButton) {
      downloadButton.onclick = () => {
        this.downloadICSFile(event);
        modal.remove();
      };
    }
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Helper methods for date formatting
  private static formatDateForGoogle(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private static formatDateForYahoo(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
}

// Export singleton instance
export const calendarService = new CalendarService();
