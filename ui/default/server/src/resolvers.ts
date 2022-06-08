import { Context } from './context'

const SERVER_START_TIME = Math.round(new Date().getTime() / 1000)

/**
 *
 * @param _parent
 * @param args
 * @param context
 * @returns Type Device
 */
const device = (_parent, args: { device_id: string }, context: Context) => {
  return context.prisma.devices.findUnique({
    where: { device_id: args.device_id || undefined },
  })
}

/**
 *
 * @param _parent
 * @param _args
 * @param context
 * @returns Array Type Devices
 */
const devices = async (_parent, _args, context: Context) => {
  const devicesResult = await context.prisma.flows.groupBy({
    by: ['device_id'],
    _sum: {
      outbound_byte_count: true,
    },
  })
  // map the devices to the flow device_id
  let devices = await Promise.all(
    devicesResult.map(async (flow) => {
      const mappedDevices = await context.prisma.devices.findUnique({
        where: {
          device_id: flow.device_id,
        },
      })
      return {
        ...mappedDevices,
        outbound_byte_count: flow._sum.outbound_byte_count,
      }
    }),
  )

  return devices
}

/**
 *
 * @param _parent
 * @param _args
 * @param context
 * @returns Array Type Flow
 */
const flows = (_parent, _args, context: Context) => {
  return context.prisma.flows.findMany({
    include: {
      device: true,
    },
  })
}

/**
 *
 * @param _parent
 * @param _args
 * @param context
 * @returns Type ServerConfig
 */
const serverConfig = (_parent, _args, context: Context) => {
  return {
    start_timestamp: SERVER_START_TIME,
  }
}

/**
 *
 * @param _parent
 * @param _args
 * @param context
 * @returns Type DeviceByCountry
 */
const deviceTrafficToCountries = async (
  _parent,
  _args: { device_id: string },
  context: Context,
) => {
  const response: any = await context.prisma.flows.groupBy({
    by: ['counterparty_country'],
    _max: { ts: true },
    _sum: { outbound_byte_count: true },
    where: {
      device_id: _args.device_id,
    },
  })

  const data = response.map((d) => {
    return {
      country_code: d.counterparty_country,
      outbound_byte_count: d._sum.outbound_byte_count,
      last_updated_time_per_country: d._max.ts,
    }
  })

  return data
}

/**
 * 
 * @param _parent 
 * @param args 
 * @param context 
 * @returns Type Flow
 */
const adsAndTrackerBytes = async (
  _parent,
  args: { current_time: number },
  context: Context,
) => {
  const flowsResult = await context.prisma.flows.aggregate({
    where: {
      counterparty_is_ad_tracking: 1,
      ts: { gte: args.current_time || SERVER_START_TIME },
    },
    _sum: {
      outbound_byte_count: true,
    },
  })
  return { _sum: flowsResult._sum.outbound_byte_count }
}

/**
 * 
 * @param _parent 
 * @param args 
 * @param context 
 * @returns Type Flow
 */
const enencryptedHttpTrafficBytes = async (
  _parent,
  args: { current_time: number },
  context: Context,
) => {
  const flowsResult = await context.prisma.flows.aggregate({
    where: {
      counterparty_port: 80,
      ts: { gte: args.current_time || SERVER_START_TIME },
    },
    _sum: {
      outbound_byte_count: true,
    },
  })
  return { _sum: flowsResult._sum.outbound_byte_count }
}

/**
 * 
 * @param _parent 
 * @param args 
 * @param context 
 * @returns Type Flow
 */
const weakEncryptionBytes = async (
  _parent,
  args: { current_time: number },
  context: Context,
) => {
  const flowsResult = await context.prisma.flows.aggregate({
    where: {
      counterparty_port: 80,
      ts: { gte: args.current_time || SERVER_START_TIME },
    },
    _sum: {
      outbound_byte_count: true,
    },
  })
  return { _sum: flowsResult._sum.outbound_byte_count }
}

export {
  device,
  devices,
  flows,
  serverConfig,
  deviceTrafficToCountries,
  adsAndTrackerBytes,
  enencryptedHttpTrafficBytes,
  weakEncryptionBytes,
}
