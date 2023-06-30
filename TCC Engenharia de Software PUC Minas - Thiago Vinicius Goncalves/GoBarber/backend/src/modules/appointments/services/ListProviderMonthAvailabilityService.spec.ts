import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2020-10-18T00:00:00.000Z'));
});
afterAll(() => {
  jest.useRealTimers();
});
describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 20, 8, 0, 0),
    });

    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 20, 9, 0, 0),
    });

    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 20, 10, 0, 0),
    });

    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 20, 11, 0, 0),
    });

    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 20, 12, 0, 0),
    });

    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 20, 13, 0, 0),
    });

    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 20, 14, 0, 0),
    });

    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 20, 15, 0, 0),
    });

    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 20, 16, 0, 0),
    });

    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 20, 17, 0, 0),
    });

    await fakeAppointmentRepository.create({
      customer_id: 'user',
      provider_id: 'user',
      date: new Date(2020, 9, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 10,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
