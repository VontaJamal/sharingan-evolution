const PARTICLES = [
  [8, 21, 1.2, 8],
  [16, 74, 0.8, 13],
  [24, 40, 1.7, 11],
  [31, 86, 1, 9],
  [39, 17, 0.7, 14],
  [47, 67, 1.4, 10],
  [54, 29, 0.9, 12],
  [62, 83, 1.5, 15],
  [69, 12, 1, 9],
  [76, 52, 1.8, 13],
  [84, 27, 0.8, 10],
  [91, 76, 1.3, 14],
  [12, 92, 0.7, 11],
  [58, 6, 1.1, 12],
  [96, 38, 0.9, 9],
] as const;

export function ChakraField() {
  return (
    <div className="chakra-field" aria-hidden="true">
      {PARTICLES.map(([x, y, size, duration], index) => (
        <i
          key={`${x}-${y}`}
          className="chakra-particle"
          style={{
            '--x': `${x}%`,
            '--y': `${y}%`,
            '--size': `${size}px`,
            '--duration': `${duration}s`,
            '--delay': `${index * -0.73}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
