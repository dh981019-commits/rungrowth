import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { hiTheme } from '@/theme/theme';

type HiCharacterProps = {
  size?: 'sm' | 'md' | 'lg';
  mood?: 'happy' | 'run' | 'pb' | 'champion' | 'sad' | 'sleep';
  style?: StyleProp<ViewStyle>;
};

const sizeMap = {
  sm: 76,
  md: 116,
  lg: 154
};

export function HiCharacter({ size = 'md', mood = 'happy', style }: HiCharacterProps) {
  const boxSize = sizeMap[size];
  const isSad = mood === 'sad';
  const isSleep = mood === 'sleep';
  const isChampion = mood === 'champion';
  const isPb = mood === 'pb';

  return (
    <View style={[styles.wrap, { width: boxSize, height: boxSize }, style]}>
      {isChampion ? <Text style={styles.crown}>♛</Text> : null}
      {isPb ? <Text style={styles.star}>★</Text> : null}
      <View style={styles.earLeft} />
      <View style={styles.earRight} />
      <View style={styles.face}>
        <View style={styles.headband}>
          <Text style={styles.headbandText}>Hi</Text>
        </View>
        <View style={styles.eyeRow}>
          <View style={[styles.eye, isSleep && styles.sleepEye]} />
          <View style={[styles.eye, isSleep && styles.sleepEye]} />
        </View>
        <View style={[styles.mouth, isSad && styles.sadMouth, isSleep && styles.sleepMouth]} />
      </View>
      <View style={[styles.body, isChampion && styles.championBody]}>
        <Text style={styles.shirtText}>{isPb ? 'PB' : 'Hi'}</Text>
      </View>
      {mood === 'run' ? <View style={styles.speedLine} /> : null}
      {isSleep ? <Text style={styles.sleepText}>Zz</Text> : null}
    </View>
  );
}

const fur = '#c98536';
const furDark = '#7a461b';

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  crown: {
    position: 'absolute',
    top: '-2%',
    zIndex: 3,
    color: hiTheme.colors.yellow,
    fontSize: 28,
    fontWeight: '900'
  },
  star: {
    position: 'absolute',
    right: '6%',
    top: '5%',
    zIndex: 3,
    color: hiTheme.colors.yellow,
    fontSize: 24,
    fontWeight: '900'
  },
  earLeft: {
    position: 'absolute',
    top: '10%',
    left: '21%',
    width: '22%',
    height: '22%',
    borderRadius: 999,
    borderWidth: 3,
    borderColor: furDark,
    backgroundColor: fur
  },
  earRight: {
    position: 'absolute',
    top: '10%',
    right: '21%',
    width: '22%',
    height: '22%',
    borderRadius: 999,
    borderWidth: 3,
    borderColor: furDark,
    backgroundColor: fur
  },
  face: {
    position: 'absolute',
    top: '15%',
    width: '68%',
    height: '58%',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 3,
    borderColor: furDark,
    backgroundColor: fur
  },
  headband: {
    position: 'absolute',
    top: '16%',
    width: '76%',
    height: '18%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#ffffff'
  },
  headbandText: {
    color: hiTheme.colors.green,
    fontSize: 12,
    fontWeight: '900'
  },
  eyeRow: {
    position: 'absolute',
    top: '45%',
    width: '52%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  eye: {
    width: 8,
    height: 12,
    borderRadius: 999,
    backgroundColor: '#151515'
  },
  sleepEye: {
    height: 3,
    marginTop: 5
  },
  mouth: {
    position: 'absolute',
    bottom: '20%',
    width: '20%',
    height: '14%',
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
    backgroundColor: '#ff6b4a'
  },
  sadMouth: {
    height: 10,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 3,
    borderTopColor: '#151515'
  },
  sleepMouth: {
    width: '14%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#151515'
  },
  body: {
    position: 'absolute',
    bottom: '4%',
    width: '48%',
    height: '32%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#ffffff'
  },
  shirtText: {
    color: hiTheme.colors.green,
    fontSize: 15,
    fontWeight: '900'
  },
  championBody: {
    backgroundColor: '#fff7d6'
  },
  speedLine: {
    position: 'absolute',
    left: '5%',
    bottom: '18%',
    width: '30%',
    height: 4,
    borderRadius: 999,
    backgroundColor: hiTheme.colors.green
  },
  sleepText: {
    position: 'absolute',
    right: '6%',
    top: '18%',
    color: hiTheme.colors.blue,
    fontSize: 14,
    fontWeight: '900'
  }
});
