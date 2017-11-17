function done(summary, latency, requests)
    tpl = [[
{
    "messages": %d,
    "transfer": %.2f,
    "rps": %.2f,
    "latency_min": %.3f,
    "latency_mean": %.3f,
    "latency_max": %.3f,
    "latency_std": %.3f,
    "latency_cv": %.2f,
    "latency_percentiles": [%s]
}]]
    transfer = (summary.bytes / (1024 * 1024)) / (summary.duration / 1000000)
    rps = summary.requests / (summary.duration / 1000000)
    latency_percentiles = {}
    percentiles = {25, 50, 75, 90, 99, 99.99}
    for i, percentile in ipairs(percentiles) do
        table.insert(
            latency_percentiles,
            string.format("[%.2f, %.3f]", percentile,
                          latency:percentile(percentile) / 1000)
        )
    end
    out = string.format(tpl, summary.requests,  transfer, rps,
                        latency.min / 1000, latency.mean / 1000,
                        latency.max / 1000, latency.stdev / 1000,
                        (latency.stdev / latency.mean) * 100,
                        table.concat(latency_percentiles, ','))
    io.stderr:write(out)
end
