import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
// TODO: Import services
// import { ticketService } from '../services/ticketService';

// TODO: Implement getTickets function
export const getTickets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Get project ID from query params (optional)
    // TODO: Fetch tickets with filters
    // TODO: Verify user has access to project
    // TODO: Return tickets list
    res.json({ message: 'Get tickets - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement getTicket function
export const getTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Get ticket ID from params
    // TODO: Verify user has access to ticket's project
    // TODO: Fetch ticket with relations
    // TODO: Return ticket
    res.json({ message: 'Get ticket - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement createTicket function
export const createTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Validate input
    // TODO: Verify user has access to project
    // TODO: Create ticket
    // TODO: Assign default status (todo)
    // TODO: Return created ticket
    res.json({ message: 'Create ticket - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement updateTicket function
export const updateTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Get ticket ID from params
    // TODO: Verify user has permission to update
    // TODO: Update ticket
    // TODO: Return updated ticket
    res.json({ message: 'Update ticket - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement deleteTicket function
export const deleteTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Get ticket ID from params
    // TODO: Verify user has permission to delete
    // TODO: Delete ticket
    // TODO: Return success
    res.json({ message: 'Delete ticket - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement updateTicketStatus function
export const updateTicketStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Get ticket ID from params
    // TODO: Get new status from body
    // TODO: Verify user has permission
    // TODO: Update ticket status
    // TODO: Handle Kanban drag & drop logic
    // TODO: Return updated ticket
    res.json({ message: 'Update ticket status - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement startTimeTracking function
export const startTimeTracking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Get ticket ID from params
    // TODO: Verify user has access
    // TODO: Start time tracking session
    // TODO: Return tracking session info
    res.json({ message: 'Start time tracking - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement stopTimeTracking function
export const stopTimeTracking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Get ticket ID from params
    // TODO: Find active tracking session
    // TODO: Calculate elapsed time
    // TODO: Update ticket spentTime
    // TODO: Return updated ticket
    res.json({ message: 'Stop time tracking - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

