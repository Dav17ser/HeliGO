import { Tour } from "../data/models/tour.model";
import { TourRepository } from "../repositories/tour.repository";

export class TourService {
  constructor(private tourRepository: TourRepository) {}

  async getAllActive(): Promise<Tour[]> {
    return this.tourRepository.findAllActive();
  }

  async getById(id: number): Promise<Tour | undefined> {
    return this.tourRepository.findById(id);
  }
}
